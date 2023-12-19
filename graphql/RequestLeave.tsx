import { gql } from "@apollo/client";

export const REQUEST_LEAVE = gql`
  mutation RequestLeave($input: LeaveInput!) {
    requestLeave(input: $input) {
      status
      message
    }
  }
`;

export const GET_LEAVE_LIST = gql`
  query GetLeaveListForMobile($limit: Int!) {
    getLeaveListForMobile(limit: $limit) {
      _id
      description
      date
      shife
      status
    }
  }
`;
