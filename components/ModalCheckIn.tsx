import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import ModalStyle from "../styles/ModalStyle.scss";
import { moderateScale } from "../ Metrics";
import { useTranslation } from "react-multi-lang";

export default function ModalCheckIn({
  location,
  CheckInIsVisible,
  handleCheckInClose,
  handleCheckInButton,
  isButtonDisabled,
}: any) {
  const t = useTranslation();
  return (
    <Modal
      visible={CheckInIsVisible}
      animationType="none"
      onRequestClose={handleCheckInClose}
      transparent={true}
    >
      <View style={ModalStyle.ModalContainer}>
        <TouchableOpacity
          style={ModalStyle.ModalBackgroundOpacity}
          onPress={handleCheckInClose}
          activeOpacity={0.2}
        />
        <View
          style={[
            ModalStyle.ModalButtonContainerMain,
            {
              height: moderateScale(200),
              borderRadius: moderateScale(10),
              borderWidth: moderateScale(1),
            },
          ]}
        >
          <View
            style={[
              ModalStyle.ModalButtonTextTitleContainerMain,
              { padding: moderateScale(20) },
            ]}
          >
            <Image
              source={
                location === null || location === undefined
                  ? require("../assets/Images/cross-outline.gif")
                  : !location
                  ? require("../assets/Images/loader-1.gif")
                  : require("../assets/Images/18-location-pin-gradient.gif")
              }
              style={{ width: moderateScale(80), height: moderateScale(80) }}
            />
            <Text
              style={[
                ModalStyle.ModalButtonTextTitleMain,
                { fontSize: moderateScale(12) },
              ]}
            >
              {location === null || !location === undefined
                ? t("I can't get your current location") +
                  "\n" +
                  t("please try again!")
                : !location
                ? t("Getting your current location") +
                  "\n" +
                  t("please wait") +
                  "\n" +
                  t("it's depend on your device")
                : t("I get your current location") +
                  "\n" +
                  t("Do you want to check in?")}
            </Text>
          </View>

          <View style={ModalStyle.ModalButtonOptionContainer}>
            <TouchableOpacity
              onPress={() => handleCheckInClose()}
              style={[
                ModalStyle.ModalButtonOptionLeft,
                {
                  padding: moderateScale(15),
                  borderTopWidth: moderateScale(1),
                },
              ]}
            >
              <Text
                style={[
                  ModalStyle.ModalButtonTextTitleMain,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {t("No")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isButtonDisabled}
              onPress={() => {
                handleCheckInClose();
                handleCheckInButton();
              }}
              style={[
                ModalStyle.ModalButtonOptionLeft,
                {
                  padding: moderateScale(15),
                  borderLeftWidth: moderateScale(1),
                  borderTopWidth: moderateScale(1),
                },
              ]}
            >
              <Text
                style={[
                  ModalStyle.ModalButtonTextTitleMain,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {isButtonDisabled ? t("load") : t("Yes")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
