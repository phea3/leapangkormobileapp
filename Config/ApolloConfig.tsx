import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function ApolloConfig({ children }: any) {
  // const URI = "";
  const URI = "192.168.2.110:4510/graphql";
  const { token } = useContext(AuthContext);

  const authLink = setContext((_, { headers }: any) => {
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

  const uploadLink = createHttpLink({
    uri: `http://${URI}`,
  });

  const client = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache({
      typePolicies: {
        Manuscript: {
          fields: {
            _currentRoles: {
              read(existing, { cache, args, readField }) {
                // const currentRoles = currentRolesVar()
              },
            },
          },
        },
      },
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
