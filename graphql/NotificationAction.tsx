import { gql } from "@apollo/client";

export const GET_NOTIFICATION_CONTACT = gql`
  query GetNotifications($limit: Int!) {
    getNotifications(limit: $limit) {
      _id
      title
      date
      time
      body
    }
  }
`;
