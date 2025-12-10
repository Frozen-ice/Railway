import { getApolloClient } from '../apollo-client';
import { START_SERVICE, STOP_SERVICE, DEPLOY_SERVICE, PAUSE_SERVICE } from '../graphql/mutations';
import { GET_SERVICE, LIST_SERVICES } from '../graphql/queries';

export interface Service {
  id: string;
  name: string;
  status: string;
  createdAt?: string;
}

export interface ServiceResponse {
  id: string;
  status: string;
}

/**
 * Get a service by ID
 */
export async function getService(serviceId: string): Promise<Service | null> {
  try {
    const client = getApolloClient();
    const { data } = await client.query({
      query: GET_SERVICE,
      variables: { serviceId },
      fetchPolicy: 'network-only',
    });
    return data?.service || null;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

/**
 * List all services in a project
 */
export async function listServices(projectId: string): Promise<Service[]> {
  try {
    const client = getApolloClient();
    const { data } = await client.query({
      query: LIST_SERVICES,
      variables: { projectId },
      fetchPolicy: 'network-only',
    });
    return data?.project?.services || [];
  } catch (error) {
    console.error('Error listing services:', error);
    throw error;
  }
}

/**
 * Spin up a container (start/restart service)
 */
export async function spinUpContainer(serviceId: string): Promise<ServiceResponse> {
  try {
    const client = getApolloClient();
    // Try START_SERVICE first, fallback to DEPLOY_SERVICE
    let mutation = START_SERVICE;
    let mutationName = 'serviceRestart';
    
    const { data } = await client.mutate({
      mutation,
      variables: { serviceId },
    });

    if (!data?.[mutationName]) {
      // Try alternative mutation
      const { data: altData } = await client.mutate({
        mutation: DEPLOY_SERVICE,
        variables: { serviceId },
      });
      return altData?.serviceDeploy || { id: serviceId, status: 'unknown' };
    }

    return data[mutationName];
  } catch (error) {
    console.error('Error spinning up container:', error);
    throw error;
  }
}

/**
 * Spin down a container (stop/pause service)
 */
export async function spinDownContainer(serviceId: string): Promise<ServiceResponse> {
  try {
    const client = getApolloClient();
    // Try STOP_SERVICE first, fallback to PAUSE_SERVICE
    let mutation = STOP_SERVICE;
    let mutationName = 'serviceStop';
    
    const { data } = await client.mutate({
      mutation,
      variables: { serviceId },
    });

    if (!data?.[mutationName]) {
      // Try alternative mutation
      const { data: altData } = await client.mutate({
        mutation: PAUSE_SERVICE,
        variables: { serviceId },
      });
      return altData?.servicePause || { id: serviceId, status: 'unknown' };
    }

    return data[mutationName];
  } catch (error) {
    console.error('Error spinning down container:', error);
    throw error;
  }
}
