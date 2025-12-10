import { gql } from '@apollo/client';

// Mutation to start/restart a service (spin up container)
export const START_SERVICE = gql`
  mutation StartService($serviceId: String!) {
    serviceRestart(id: $serviceId) {
      id
      status
    }
  }
`;

// Mutation to stop a service (spin down container)
export const STOP_SERVICE = gql`
  mutation StopService($serviceId: String!) {
    serviceStop(id: $serviceId) {
      id
      status
    }
  }
`;

// Alternative mutations if the API uses different names
export const DEPLOY_SERVICE = gql`
  mutation DeployService($serviceId: String!) {
    serviceDeploy(id: $serviceId) {
      id
      status
    }
  }
`;

export const PAUSE_SERVICE = gql`
  mutation PauseService($serviceId: String!) {
    servicePause(id: $serviceId) {
      id
      status
    }
  }
`;

