import dynamicImport from 'next/dynamic';

export const dynamic = 'force-static';
export const revalidate = false;

const HomeClient = dynamicImport(() => import('@/components/HomeClient'), {
  ssr: false
});

export default function Home() {
  return <HomeClient />;
}
