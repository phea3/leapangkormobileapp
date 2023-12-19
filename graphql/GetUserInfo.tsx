import { gql } from "@apollo/client";

export const GET_USER_INFO = gql`
  query GetUserInfoMobile {
    getUserInfoMobile {
      profileImage
      latinName
      position
    }
  }
`;
