import { gql } from "@apollo/client";

export const GETEMPLOYEELEAVEINFO = gql`
  query GetEmployeeLeaveInfo($employeeId: ID!) {
    getEmployeeLeaveInfo(employeeId: $employeeId) {
      al
      permission
      late
      fine
    }
  }
`;
