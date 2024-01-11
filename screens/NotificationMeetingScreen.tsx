import { View, Text } from "react-native";
import NotificaitonMeetingStyle from "../styles/NotificationMeetingStyle.scss";
import { moderateScale } from "../ Metrics";

export default function NotificationMeetingScreen() {
  return (
    <View style={NotificaitonMeetingStyle.NotificationMeetingContainer}>
      <Text
        style={[
          NotificaitonMeetingStyle.NotificationMeetingTitle,
          { fontSize: moderateScale(14) },
        ]}
      >
        This feature is not availble!
      </Text>
    </View>
  );
}
