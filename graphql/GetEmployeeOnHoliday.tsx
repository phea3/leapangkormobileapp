import { gql } from "@apollo/client";

export const GET_EMPLOYEEONHOLIDAY = gql`
  query GetEmployeeOnHoliday {
    getEmployeeOnHoliday {
      _id
      profileImage
      latinName
      reason
      shiftOff
      dateLeave
    }
  }
`;
