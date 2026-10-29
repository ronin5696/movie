import CountryHomePage, { generateMetadata as generateCountryMetadata } from './[country]/page';

export async function generateMetadata(props) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  return generateCountryMetadata({
    params: Promise.resolve({ country: 'us' }),
    searchParams,
  });
}

export default async function RootPage(props) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  return CountryHomePage({
    params: Promise.resolve({ country: 'us' }),
    searchParams,
  });
}
