import { gql } from "@apollo/client";

export const GETCHECKINOUTBUTTON = gql`
  query GetCheckInOutButton($shift: AllowShift!) {
    getCheckInOutButton(shift: $shift) {
      checkIn
      checkOut
    }
  }
`;
