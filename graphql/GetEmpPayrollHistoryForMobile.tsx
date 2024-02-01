import { gql } from "@apollo/client";

export const GETEMPPAYROLLHISTORYFORMOBILE = gql`
  query GetEmpPayrollHistoryForMobile($limit: Int!) {
    getEmpPayrollHistoryForMobile(limit: $limit) {
      _id
      date
    }
  }
`;
