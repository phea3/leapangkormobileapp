import { ImageBackground, Platform, StatusBar, View } from "react-native";
import { Outlet } from "react-router-native";
import LayoutStyle from "../styles/LayoutStyle.scss";

export default function LoginLayout() {
  return (
    <ImageBackground
      source={require("../assets/Images/Artboard-3.png")}
      resizeMode="cover"
      style={LayoutStyle.LoginLayoutContainer}
    >
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
      />
      <Outlet />
    </ImageBackground>
  );
}
