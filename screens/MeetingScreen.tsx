import { Image, Text, TouchableOpacity, View } from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function MeetingScreen() {
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
            MEETINGS
          </Text>
        </TouchableOpacity>
      </View>
      <View style={MeetingStyle.MeetingBodyContainer}>
        <Text
          style={
            dimension === "sm"
              ? MeetingStyle.MeetingTitleSM
              : MeetingStyle.MeetingTitle
          }
        >
          This feature is not availeble!
        </Text>
      </View>
    </View>
  );
}
