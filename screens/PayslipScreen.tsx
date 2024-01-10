import { Image, Text, TouchableOpacity, View } from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import PayslipStyle from "../styles/PayslipStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function PayslipScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  return (
    <View style={MeetingStyle.MeetingContainer}>
      <View style={MeetingStyle.MeetingBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={
            dimension === "sm"
              ? MeetingStyle.MeetingBackButtonSM
              : MeetingStyle.MeetingBackButton
          }
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={
              dimension === "sm"
                ? MeetingStyle.MeetingBackButtonIconSM
                : MeetingStyle.MeetingBackButtonIcon
            }
          />
          <Text
            style={
              dimension === "sm"
                ? MeetingStyle.MeetingBackButtonTitleSM
                : MeetingStyle.MeetingBackButtonTitle
            }
          >
            PAYSLIP
          </Text>
        </TouchableOpacity>
      </View>
      <View style={PayslipStyle.PayslipBodyContainer}>
        <TouchableOpacity
          style={PayslipStyle.PayslipButtonContainer}
          onPress={() => navigate("/monthlypayslip")}
        >
          <Image
            source={require("../assets/Images/security.png")}
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <View>
            <Text
              style={
                dimension === "sm"
                  ? MeetingStyle.MeetingTitleSM
                  : MeetingStyle.MeetingTitle
              }
            >
              Payslip for the month of may 2023
            </Text>
            <Text>see more...</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
