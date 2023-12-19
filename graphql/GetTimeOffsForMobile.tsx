import { gql } from "@apollo/client";

export const GETTIMEOFFSFORMOBILE = gql`
  query GetTimeOffsForMobile {
    getTimeOffsForMobile {
      _id
      timeOff
    }
  }
`;
