import { redirect } from 'next/navigation';

export default function RootPage() {
  // If request bypasses middleware, redirect safely to default regional structure
  redirect('/us');
}
