import { View, Text } from "react-native";
import NotificaitonMeetingStyle from "../styles/NotificationMeetingStyle.scss";
import { moderateScale } from "../ Metrics";
import { useTranslation } from "react-multi-lang";

export default function NotificationMeetingScreen() {
  const t = useTranslation();
  return (
    <View style={NotificaitonMeetingStyle.NotificationMeetingContainer}>
      <Text
        style={[
          NotificaitonMeetingStyle.NotificationMeetingTitle,
          { fontSize: moderateScale(14) },
        ]}
      >
        {t("This feature is not availble!")}
      </Text>
    </View>
  );
}
