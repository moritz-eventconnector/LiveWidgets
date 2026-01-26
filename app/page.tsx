import HomePage from '@/components/HomePage';

export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return <HomePage />;
}
