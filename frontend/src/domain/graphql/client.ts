import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from '@apollo/client/core';

const HTTP_LINK =
  'https://4qfljing7rct7aeewwjhngoziu.appsync-api.us-east-1.amazonaws.com/graphql';

const API_KEY = 'da2-5xxgzzrewfdtvexpe5jvjctg6a';

const link = createHttpLink({
  uri: HTTP_LINK,
  headers: {
    'x-api-key': API_KEY,
  },
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const client = new ApolloClient({
  link,
  cache,
});

export { client, gql };
