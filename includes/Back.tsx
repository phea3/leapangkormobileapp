import { useContext, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import HeaderStyle from "../styles/HeaderStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import { Image, Text, View } from "react-native";
import { useNavigate } from "react-router-native";

export default function Back() {
  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <TouchableOpacity
      style={
        dimension === "sm"
          ? HeaderStyle.HeaderLeftSideContainerSM
          : HeaderStyle.HeaderLeftSideContainer
      }
      onPress={() => {
        navigate("/home/main");
      }}
    >
      <Image
        source={require("../assets/Images/back.png")}
        style={
          dimension === "sm"
            ? HeaderStyle.HeaderBackIconSM
            : HeaderStyle.HeaderBackIcon
        }
      />
      <View
        style={
          dimension === "sm"
            ? HeaderStyle.HeaderTitleContainerSM
            : HeaderStyle.HeaderTitleContainer
        }
      >
        <Text
          style={
            dimension === "sm"
              ? HeaderStyle.HeaderTitle1SM
              : HeaderStyle.HeaderTitle1
          }
        >
          ការគ្រប់គ្រងកម្មវិធី
        </Text>
      </View>
    </TouchableOpacity>
  );
}
