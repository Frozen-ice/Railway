'use client';

import { useState, useEffect } from 'react';
import { listServices, getService, type Service } from '@/lib/api/container-service';
import { ContainerCard } from './ContainerCard';

interface ContainerListProps {
	projectId?: string;
}

export function ContainerList({ projectId: initialProjectId }: ContainerListProps) {
	const [containers, setContainers] = useState<Service[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [serviceId, setServiceId] = useState('');
	const [projectId, setProjectId] = useState(initialProjectId || '');
	const [viewMode, setViewMode] = useState<'list' | 'single'>('list');

	const fetchContainers = async () => {
		setIsLoading(true);
		setError(null);
		try {
			if (viewMode === 'list' && projectId) {
				const services = await listServices(projectId);
				setContainers(services);
			} else if (viewMode === 'single' && serviceId) {
				const service = await getService(serviceId);
				setContainers(service ? [service] : []);
			} else {
				setContainers([]);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch containers');
			setContainers([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if ((viewMode === 'list' && projectId) || (viewMode === 'single' && serviceId)) {
			fetchContainers();
		} else {
			setContainers([]);
			setIsLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId, serviceId, viewMode]);

	const handleRefresh = () => {
		fetchContainers();
	};

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
						Container Management
					</h2>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						Manage your Railway containers using GraphQL API
					</p>
				</div>
				<button
					onClick={handleRefresh}
					disabled={isLoading}
					className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
				>
					{isLoading ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>

			<div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex gap-2">
						<button
							onClick={() => setViewMode('list')}
							className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'list'
								? 'bg-blue-600 text-white dark:bg-blue-700'
								: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
								}`}
						>
							List by Project
						</button>
						<button
							onClick={() => setViewMode('single')}
							className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'single'
								? 'bg-blue-600 text-white dark:bg-blue-700'
								: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
								}`}
						>
							Single Service
						</button>
					</div>
					{viewMode === 'list' ? (
						<input
							type="text"
							placeholder="Enter Project ID"
							value={projectId}
							onChange={(e) => setProjectId(e.target.value)}
							className="flex-1 px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					) : (
						<input
							type="text"
							placeholder="Enter Service ID"
							value={serviceId}
							onChange={(e) => setServiceId(e.target.value)}
							className="flex-1 px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					)}
				</div>
				<p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
					{viewMode === 'list'
						? 'Enter your Railway Project ID to list all services'
						: 'Enter a Service ID to view and manage a specific container'}
				</p>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p className="text-sm text-red-800 dark:text-red-300 font-medium">Error</p>
					<p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
				</div>
			)}

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			) : containers.length === 0 ? (
				<div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">
						{viewMode === 'list'
							? 'No containers found. Enter a Project ID to get started.'
							: 'No container found. Enter a Service ID to view it.'}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{containers.map((container) => (
						<ContainerCard
							key={container.id}
							container={container}
							onUpdate={handleRefresh}
						/>
					))}
				</div>
			)}
		</div>
	);
}

