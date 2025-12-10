'use client';

import { useState } from 'react';
import { spinUpContainer, spinDownContainer, type Service } from '@/lib/api/container-service';

interface ContainerCardProps {
  container: Service;
  onUpdate: () => void;
}

export function ContainerCard({ container, onUpdate }: ContainerCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpinUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await spinUpContainer(container.id);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to spin up container');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinDown = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await spinDownContainer(container.id);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to spin down container');
    } finally {
      setIsLoading(false);
    }
  };

  const isRunning = container.status?.toLowerCase().includes('running') ||
    container.status?.toLowerCase().includes('active') ||
    container.status?.toLowerCase().includes('deployed');
  const isStopped = container.status?.toLowerCase().includes('stopped') ||
    container.status?.toLowerCase().includes('paused') ||
    container.status?.toLowerCase().includes('inactive');

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {container.name || `Container ${container.id.slice(0, 8)}`}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">
            {container.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isRunning
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : isStopped
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isRunning
                ? 'bg-green-500'
                : isStopped
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
                }`}
            />
            {container.status || 'Unknown'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSpinUp}
          disabled={isLoading || isRunning}
          className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${isLoading || isRunning
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
            : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
            }`}
        >
          {isLoading ? 'Processing...' : 'Spin Up'}
        </button>
        <button
          onClick={handleSpinDown}
          disabled={isLoading || isStopped}
          className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${isLoading || isStopped
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
            : 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
            }`}
        >
          {isLoading ? 'Processing...' : 'Spin Down'}
        </button>
      </div>

      {container.createdAt && (
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          Created: {new Date(container.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

