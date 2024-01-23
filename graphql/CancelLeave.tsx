import { gql } from "@apollo/client";

export const CANCELLEAVE = gql`
  mutation CancelLeave($leaveId: ID!, $hrComment: String!) {
    cancelLeave(leaveID: $leaveId, hrComment: $hrComment) {
      status
      message
    }
  }
`;
