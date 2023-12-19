import { gql } from "@apollo/client";

export const MOBILE_LOGIN = gql`
  mutation MobileLogin($email: String!, $password: String!) {
    mobileLogin(email: $email, password: $password) {
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
