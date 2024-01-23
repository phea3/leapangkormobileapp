import { gql } from "@apollo/client";

export const GETPUBLICHOLIDAYBYEMPLOYEE = gql`
  query GetPublicHolidayByEmployee($employeeId: ID!, $year: String) {
    getPublicHolidayByEmployee(employeeId: $employeeId, year: $year) {
      _id
      title
      titleId
      totalDay
      year
      status
      remain
    }
  }
`;
