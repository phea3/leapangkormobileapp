import { Image, Modal, Text, TouchableOpacity } from "react-native";
import ModalStyle from "../styles/ModalStyle.scss";
import { View } from "react-native-animatable";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-native";

export default function CheckModal({ isVisible, handleClose, data }: any) {
  const { dimension } = useContext(AuthContext);
  // console.log(data);
  const navigate = useNavigate();
  return (
    <Modal
      visible={isVisible}
      animationType="none"
      onRequestClose={handleClose}
      transparent={true}
    >
      <View style={ModalStyle.ModalContainer}>
        <TouchableOpacity
          style={ModalStyle.ModalBackgroundOpacity}
          onPress={() => {
            handleClose();
            setTimeout(() => {
              if (data?.status === true) {
                navigate("/attendance");
              }
            }, 500);
          }}
          activeOpacity={0.2}
        />
        <View
          style={
            data?.status === true
              ? ModalStyle.ModalButtonContainer
              : ModalStyle.ModalButtonContainerFail
          }
        >
          <Image
            source={
              data?.status === true
                ? require("../assets/Images/check-outline.gif")
                : require("../assets/Images/cross-outline.gif")
            }
            style={
              dimension === "sm"
                ? ModalStyle.ModalImageAfterCheckSM
                : ModalStyle.ModalImageAfterCheck
            }
          />
          <Text
            style={
              dimension === "sm"
                ? ModalStyle.ModalButtonTextTitleSM
                : ModalStyle.ModalButtonTextTitle
            }
          >
            {data?.status === true ? "Success!" : "Fail!"}
          </Text>
          <Text
            style={
              dimension === "sm"
                ? ModalStyle.ModalButtonTextBodySM
                : ModalStyle.ModalButtonTextBody
            }
          >
            {data ? data?.message : ""}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
