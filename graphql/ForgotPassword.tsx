import { gql } from "@apollo/client";

export const FORGOT_PASSWORD = gql`
  query ForgortUserPassword($email: String!) {
    forgortUserPassword(email: $email) {
      status
      title
      description
    }
  }
`;
