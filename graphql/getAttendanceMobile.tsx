import { gql } from "@apollo/client";

export const GETATTENDANCEMOBILE = gql`
  query GetAttendanceMobile($limit: Int!) {
    getAttendanceMobile(limit: $limit) {
      _id
      latinName
      date
      morning
      afternoon
      attendances {
        afternoon
        morning
      }
      fine
      branch
      remark
    }
  }
`;
