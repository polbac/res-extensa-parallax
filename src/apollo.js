import { PrismicLink } from "apollo-link-prismic";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";
 
const client = new ApolloClient({
  link: PrismicLink({
    uri: config.api,
  }),
  cache: new InMemoryCache()
})

export const query = q => client.query({
  query: gql(q)
})