import { gql } from "@apollo/client";

export const GET_USER_MOBILE_LOGIN = gql`
  query GetUserMobileLogin($token: String) {
    getUserMobileLogin(token: $token) {
      user {
        _id
        firstName
        lastName
        latinName
        role
        email
        profileImage
      }
      token
      status
      message
    }
  }
`;
