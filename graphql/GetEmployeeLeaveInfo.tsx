import { gql } from "@apollo/client";

export const GETEMPLOYEELEAVEINFO = gql`
  query GetEmployeeLeaveInfo($employeeId: ID!, $month: Int, $year: Int) {
    getEmployeeLeaveInfo(employeeId: $employeeId, month: $month, year: $year) {
      permission
      late
      outEarly
      fine
    }
  }
`;
