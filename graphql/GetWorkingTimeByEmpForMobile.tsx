import { gql } from "@apollo/client";

export const GETWKORINGTIMEBYEMPFORMOBILE = gql`
  query GetWorkingTimeByEmpForMobile {
    getWorkingTimeByEmpForMobile {
      _id
      shiftName
    }
  }
`;
