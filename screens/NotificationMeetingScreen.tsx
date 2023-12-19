import { View, Text } from "react-native";
import NotificaitonMeetingStyle from "../styles/NotificationMeetingStyle.scss";

export default function NotificationMeetingScreen() {
  return (
    <View style={NotificaitonMeetingStyle.NotificationMeetingContainer}>
      <Text style={NotificaitonMeetingStyle.NotificationMeetingTitle}>
        This feature is not availble!
      </Text>
    </View>
  );
}
