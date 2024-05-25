import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client/core";

// @ts-ignore
const HTTP_LINK = import.meta.env.VITE_API_HOST;
// @ts-ignore
const API_KEY = import.meta.env.VITE_API_KEY;

const link = createHttpLink({
  uri: HTTP_LINK,
  headers: {
    "x-api-key": API_KEY,
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
