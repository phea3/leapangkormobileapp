import { gql } from "@apollo/client";

export const CHECKVERSIONALLOW = gql`
  query CheckVersionAllow($version: String, $os: osEnum) {
    checkVersionAllow(version: $version, os: $os)
  }
`;
