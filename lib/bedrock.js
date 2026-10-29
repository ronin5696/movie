import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

/**
 * Amazon Bedrock Client setup
 * Works seamlessly with IAM Role on AWS Amplify or standard environment variables locally.
 */
function getBedrockClient() {
  const region = process.env.AWS_REGION || 'us-east-1';

  const config = { region };

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return new BedrockRuntimeClient(config);
}

/**
 * Generate engaging, compliant "burning questions" and social hooks for trending movies
 * Powered by Meta Llama 3.3 70B on Bedrock
 * 
 * @param {Array} movies List of TMDB movie objects
 * @returns {Promise<Array>} Array of generated hooks per movie
 */
export async function generateTrendingHooksWithBedrock(movies = []) {
  if (!movies.length) return [];

  // Default / graceful fallback if AWS Bedrock is not configured
  const hasAwsConfig = (
    process.env.AWS_ACCESS_KEY_ID || 
    process.env.AWS_ROLE_ARN || 
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
  );

  if (!hasAwsConfig) {
    console.warn('AWS Bedrock credentials not detected. Providing high-converting fallback hooks.');
    return movies.map((m) => ({
      id: m.id,
      title: m.title,
      burningQuestion: `Did you catch the hidden twist teased in the new ${m.title} trailer?`,
      debateAngle: `Why fans are split over the latest revelation in ${m.title}`,
      socialHook: `Wait until you see what happens at the end of ${m.title}...`,
    }));
  }

  try {
    const client = getBedrockClient();

    // Prepare concise metadata for Llama 3.3
    const movieSummaries = movies.slice(0, 10).map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview ? m.overview.slice(0, 160) : '',
      release_date: m.release_date || '',
    }));

    const systemPrompt = `You are a high-tier Hollywood entertainment curator and viral headline editor.
Your objective is to write high-CTR, curiosity-inducing "burning questions" and discussion angles for movies based on their trailers and plots.
CRITICAL RULES:
1. NEVER use deceptive clickbait like "Download Full Movie" or fake leaks.
2. Focus on genuine curiosity: hidden clues in trailers, character motives, post-credit theories, ending ambiguities, and ethical debates.
3. Respond ONLY with a valid JSON array matching the format:
[
  {
    "id": 12345,
    "title": "Movie Name",
    "burningQuestion": "Compelling question under 15 words",
    "debateAngle": "Short debate point under 15 words",
    "socialHook": "Viral hook for Reddit/X under 20 words"
  }
]`;

    const userPrompt = `Here are the top trending movies today:\n${JSON.stringify(movieSummaries, null, 2)}\n\nGenerate the JSON array for each movie now.`;

    const promptPayload = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${userPrompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

    // Bedrock model ID for Llama 3.3 70B Instruct
    const modelId = process.env.BEDROCK_MODEL_ID || 'meta.llama3-3-70b-instruct-v1:0';

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: promptPayload,
        max_gen_len: 1200,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.generation || responseBody.outputs?.[0]?.text || '';

    // Extract JSON array from response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    console.warn('Llama 3.3 did not return JSON format, using standard hooks.');
  } catch (error) {
    console.error('Amazon Bedrock Llama 3.3 invocation error:', error);
  }

  // Graceful fallback on error
  return movies.map((m) => ({
    id: m.id,
    title: m.title,
    burningQuestion: `What does the ending of ${m.title} really mean? Clues and theories explained.`,
    debateAngle: `The biggest unanswered questions from ${m.title}`,
    socialHook: `The ending of ${m.title} left everyone stunned. Here is what you missed:`,
  }));
}
