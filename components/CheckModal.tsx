import { Image, Modal, Text, TouchableOpacity } from "react-native";
import ModalStyle from "../styles/ModalStyle.scss";
import { View } from "react-native-animatable";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-native";
import { moderateScale } from "../ Metrics";

export default function CheckModal({
  location,
  isVisible,
  handleClose,
  data,
  load,
}: any) {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);

  // console.log(data);
  useEffect(() => {
    if (data?.status === true) {
      setTimeout(() => {
        navigate("/attendance");
      }, 500);
    }
  }, [data?.status]);

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
          // onPress={() => {
          //   handleClose();
          // }}
          activeOpacity={0.2}
        />
        <View
          style={[
            ModalStyle.ModalButtonContainer,
            {
              height: moderateScale(200),
              borderRadius: moderateScale(10),
              borderWidth: moderateScale(1),
            },
          ]}
        >
          <Image
            source={
              load
                ? require("../assets/Images/loader-1.gif")
                : data?.status === null
                ? require("../assets/Images/cross-outline.gif")
                : data?.status === true
                ? require("../assets/Images/check-outline.gif")
                : require("../assets/Images/cross-outline.gif")
            }
            style={{ width: moderateScale(80), height: moderateScale(80) }}
          />
          <Text
            style={[
              ModalStyle.ModalButtonTextTitle,
              { fontSize: moderateScale(18) },
            ]}
          >
            {load
              ? "Loading"
              : data?.status === null
              ? "Can't get your location."
              : data?.status === true
              ? "Success!"
              : "Fail!"}
          </Text>
          <Text
            style={[
              ModalStyle.ModalButtonTextBody,
              { fontSize: moderateScale(14) },
            ]}
          >
            {load
              ? `Getting your current location. \n please wait... \n it's depend on your device.`
              : data?.status === null
              ? "Please try again."
              : data
              ? data?.message
              : ""}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
