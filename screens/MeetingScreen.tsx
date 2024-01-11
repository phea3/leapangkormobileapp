import { Image, Text, TouchableOpacity, View } from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";

export default function MeetingScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
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
            PAYSLIPS
          </Text>
        </TouchableOpacity>
      </View>
      <View style={MeetingStyle.MeetingBodyContainer}>
        <Text
          style={[MeetingStyle.MeetingTitle, { fontSize: moderateScale(14) }]}
        >
          This feature is not availeble!
        </Text>
      </View>
    </View>
  );
}
