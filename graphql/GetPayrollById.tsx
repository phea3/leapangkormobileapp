import { gql } from "@apollo/client";

export const GETPAYROLLBYID = gql`
  query GetPayrollById($id: ID) {
    getPayrollById(_id: $id) {
      _id
      IdNo
      latinName
      position
      date
      affair
      branch
      joinDate
      baseSalary
      paymentMethod
      bank
      bankNumber
      bankAccountName
      workingDay
      workingHour
      tax
      salaryPerDay
      late
      unpaidLeave
      bonus {
        bonusAmount
        bonusDay
        bonusTitle
        bonusHour
        bonusAmountInUnit
      }
      overtime {
        overtimeAmount
        overtimeTitle
        overtimeDay
        overtimeHour
        overtimeAmountInUnit
      }
      withHoldingList {
        withHoldingId
        withHoldingTitle
        amount
      }
      timeOffList {
        timeOffId
        timeOffTitle
        day
        amount
      }
      allowanceList {
        allowanceTitle
        amount
        qty
        totalAmount
        allowanceId
      }
      recentPayrollOwe {
        payrollId
        remain
        month
        paidAmount
        paidDate
      }
      netSalary
      paidAmount
    }
  }
`;
