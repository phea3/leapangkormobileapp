import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import ModalStyle from "../styles/ModalStyle.scss";
import { moderateScale } from "../ Metrics";

export default function ModalCheckOut({
  location,
  CheckOutIsVisible,
  handleCheckOutClose,
  handleCheckOutButton,
  isButtonDisabledOut,
}: any) {
  return (
    <Modal
      visible={CheckOutIsVisible}
      animationType="none"
      onRequestClose={handleCheckOutClose}
      transparent={true}
    >
      <View style={ModalStyle.ModalContainer}>
        <TouchableOpacity
          style={ModalStyle.ModalBackgroundOpacity}
          onPress={handleCheckOutClose}
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
              {location === null || location === undefined
                ? "I can't get your current location. \n please try again!"
                : !location
                ? `Getting your current location. \n please wait... \n it's depend on your device.`
                : "I get your current location. \n Do you want to check Out?"}
            </Text>
          </View>

          <View style={ModalStyle.ModalButtonOptionContainer}>
            <TouchableOpacity
              onPress={() => handleCheckOutClose()}
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
                  { fontSize: moderateScale(16) },
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isButtonDisabledOut}
              onPress={() => {
                handleCheckOutClose();
                handleCheckOutButton();
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
                  { fontSize: moderateScale(16) },
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
