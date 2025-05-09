import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
  credentials: 'include',
});

// No need to manually add Authorization headers if cookies are used
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

// Create a global error handler
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Global error logging
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
        extensions
      );
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        console.warn('Authentication error. User may need to log in again.');
        window.location.href = '/';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
  
  // Let component-level error handlers display toasts to the user
  // since we can't use React hooks here
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

export default client;
