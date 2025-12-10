import { gql } from '@apollo/client';

// Query to get service/container status
export const GET_SERVICE = gql`
  query GetService($serviceId: String!) {
    service(id: $serviceId) {
      id
      name
      status
      createdAt
    }
  }
`;

// Query to list all services/containers
export const LIST_SERVICES = gql`
  query ListServices($projectId: String!) {
    project(id: $projectId) {
      services {
        id
        name
        status
        createdAt
      }
    }
  }
`;

