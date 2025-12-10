'use client';

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

let apolloClientInstance: ApolloClient<any> | null = null;

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'https://api.railway.app/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = process.env.NEXT_PUBLIC_RAILWAY_API_TOKEN;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'content-type': 'application/json',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
}

export function getApolloClient() {
  // Create a new client for each request in server components
  // Reuse client in client components
  if (typeof window === 'undefined') {
    return createApolloClient();
  }
  
  if (!apolloClientInstance) {
    apolloClientInstance = createApolloClient();
  }
  
  return apolloClientInstance;
}
