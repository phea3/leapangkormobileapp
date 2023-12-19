import { gql } from "@apollo/client";

export const GET_EMPLOYEEBYID = gql`
  query GetEmployeeById($id: ID!) {
    getEmployeeById(_id: $id) {
      workingStatus
    }
  }
`;
