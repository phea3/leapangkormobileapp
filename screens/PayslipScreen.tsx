import { Image, Text, TouchableOpacity, View } from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import PayslipStyle from "../styles/PayslipStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";

export default function PayslipScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
        },
      ]}
    >
      <View style={MeetingStyle.MeetingBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={[
            MeetingStyle.MeetingBackButton,
            { padding: moderateScale(15) },
          ]}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              marginRight: moderateScale(10),
            }}
          />
          <Text
            style={[
              MeetingStyle.MeetingBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
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
            style={{
              width: moderateScale(50),
              height: moderateScale(50),
              marginRight: moderateScale(10),
            }}
          />
          <View>
            <Text
              style={[
                MeetingStyle.MeetingTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              Payslip for the month of may 2023
            </Text>
            <Text
              style={[
                MeetingStyle.MonthlyPayslipGrossBody,
                { fontSize: moderateScale(14) },
              ]}
            >
              see more...
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
