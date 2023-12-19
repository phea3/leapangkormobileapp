import { gql } from "@apollo/client";

export const EMPLOYEECHECKATTENDANCE = gql`
  mutation EmployeeCheckAttendance(
    $longitude: String!
    $latitude: String!
    $shift: AllowShift!
    $scan: AllowScanAction!
  ) {
    employeeCheckAttendance(
      longitude: $longitude
      latitude: $latitude
      shift: $shift
      scan: $scan
    ) {
      status
      message
    }
  }
`;
