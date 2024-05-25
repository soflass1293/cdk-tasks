import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
  gql,
} from "@apollo/client/core";

const HTTP_LINK =
  "https://3c45ver6qbfjvehtm3cvigmwvm.appsync-api.us-east-1.amazonaws.com/graphql";
const WS_LINK =
  "ws://3c45ver6qbfjvehtm3cvigmwvm.appsync-realtime-api.us-east-1.amazonaws.com/graphql";
const API_KEY = "da2-mfqlrdst6vdwpa2wl2a3gdte3u";

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
  fetchOptions: {
    credentials: "include",
  },
});

export { client, gql };
