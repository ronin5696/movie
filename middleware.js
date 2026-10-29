import { NextResponse } from 'next/server';

// Known two-letter country codes regex (e.g., /us, /in, /gb, /ca, /au, /de, /fr)
const COUNTRY_PATH_REGEX = /^\/([a-z]{2})(\/.*)?$/i;

/**
 * Multi-Tier Intelligent Region Detection:
 * 1. User-selected preference stored in cookie ('watchrelax_country')
 * 2. CloudFront Edge Headers on AWS Amplify ('cloudfront-viewer-country')
 * 3. Fallback Accept-Language header (critical for localhost development from India/other regions)
 * 4. Default fallback ('us')
 */
function detectViewerCountry(request) {
  // Tier 1: User Cookie Override
  const cookieCountry = request.cookies.get('watchrelax_country')?.value;
  if (cookieCountry && /^[a-z]{2}$/i.test(cookieCountry)) {
    return cookieCountry.toLowerCase();
  }

  // Tier 2: AWS Amplify / CloudFront / CDN Edge Headers
  const edgeCountry =
    request.headers.get('cloudfront-viewer-country') ||
    request.headers.get('x-amz-cf-header-country') ||
    request.headers.get('x-country-code') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country');

  if (edgeCountry && /^[a-z]{2}$/i.test(edgeCountry)) {
    return edgeCountry.toLowerCase();
  }

  // Tier 3: Accept-Language Browser Locale Fallback (Localhost & Dev Support)
  const acceptLanguage = request.headers.get('accept-language') || '';

  // Detect Indian locale codes (-IN, hi, ta, te, bn, mr, gu, kn, ml, pa)
  if (/(-IN\b|hi\b|ta\b|te\b|bn\b|mr\b|gu\b|kn\b|ml\b|pa\b)/i.test(acceptLanguage)) {
    return 'in';
  }

  // Generic 2-letter country subtag e.g. en-GB, en-CA, en-AU, fr-FR, de-DE
  const genericMatch = acceptLanguage.match(/[a-z]{2}-([A-Z]{2})\b/i);
  if (genericMatch && genericMatch[1]) {
    return genericMatch[1].toLowerCase();
  }

  // Tier 4: Global Default Fallback
  return 'us';
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, internal next routes, sitemaps, robots, and API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const userCountry = detectViewerCountry(request);

  // Check if pathname already begins with a 2-letter country code (e.g., /in, /us, /gb)
  const match = pathname.match(COUNTRY_PATH_REGEX);

  if (!match) {
    // Case 1: Root path "/" -> Redirect to detected localized country path "/[country]"
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/${userCountry}`;
      const response = NextResponse.redirect(url);
      response.cookies.set('watchrelax_country', userCountry, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }

    // Case 2: Direct unlocalized movie path e.g. "/movie/123" -> Redirect to "/[country]/movie/123"
    if (pathname.startsWith('/movie/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/${userCountry}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set('watchrelax_country', userCountry, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }
  }

  // Clone headers and append detected country for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-country', match ? match[1].toLowerCase() : userCountry);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
