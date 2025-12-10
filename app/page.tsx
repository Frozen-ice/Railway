import { ContainerList } from '@/components/ContainerList';

export default function Home() {
  const projectId = process.env.NEXT_PUBLIC_RAILWAY_PROJECT_ID;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Railway Container Manager
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Spin up and spin down containers using Railway&apos;s GraphQL API
          </p>
        </div>
        <ContainerList projectId={projectId} />
      </main>
    </div>
  );
}
