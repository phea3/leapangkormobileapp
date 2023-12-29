import { gql } from "@apollo/client";

export const GETEMPLOYEELEAVEINFO = gql`
  query GetEmployeeLeaveInfo($employeeId: ID!) {
    getEmployeeLeaveInfo(employeeId: $employeeId) {
      dayOfTimeOff
      permission
      late
      fine
    }
  }
`;
