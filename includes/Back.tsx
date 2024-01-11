import { useContext, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import HeaderStyle from "../styles/HeaderStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import { Image, Text, View } from "react-native";
import { useNavigate } from "react-router-native";
import { moderateScale } from "../ Metrics";

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
        style={{
          width: moderateScale(20),
          height: moderateScale(20),
          marginRight: moderateScale(10),
        }}
      />
      <View
        style={
          dimension === "sm"
            ? HeaderStyle.HeaderTitleContainerSM
            : HeaderStyle.HeaderTitleContainer
        }
      >
        <Text
          style={[HeaderStyle.HeaderTitle1, { fontSize: moderateScale(14) }]}
        >
          ការគ្រប់គ្រងកម្មវិធី
        </Text>
      </View>
    </TouchableOpacity>
  );
}
