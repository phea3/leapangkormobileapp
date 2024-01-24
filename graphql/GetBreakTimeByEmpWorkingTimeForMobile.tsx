import { gql } from "@apollo/client";

export const GETBREAKTIMEBYEMPWORKINGTIMEFORMOBILE = gql`
  query GetBreakTimeByEmpWorkingTimeForMobile($workingTimeId: ID) {
    getBreakTimeByEmpWorkingTimeForMobile(workingTimeId: $workingTimeId) {
      firstStart
      firstEnd
      secondStart
      secondEnd
    }
  }
`;
