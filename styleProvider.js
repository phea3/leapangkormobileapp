import React, { createContext } from "react";
import { Dimensions } from "react-native";
import * as Font from "expo-font";

export const StyleController = createContext();
export default function StyleProvider({ children }) {
  const [loaded] = Font.useFonts({
    "Kantumruy-Bold": require("./assets/fonts/Kantumruy-Bold.ttf"),
    "Kantumruy-Light": require("./assets/fonts/Kantumruy-Light.ttf"),
    "Kantumruy-Regular": require("./assets/fonts/Kantumruy-Regular.ttf"),
    "Bayon-Regular": require("./assets/fonts/Bayon-Regular.ttf"),
    KhmerOS_siemreap: require("./assets/fonts/KhmerOS_siemreap.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  // const styleState = {
  //   bgColor: "#000000",
  //   textColor: "#ffffff",
  //   fullScreen: Dimensions.get("screen").height,
  //   bayonKh: "Bayon-Regular",
  //   kanLight: "Kantumruy-Light",
  //   kanRegular: "Kantumruy-Regular",
  //   kanBold: "Kantumruy-Bold",
  //   KhmerOS_siemreap: "KhmerOS_siemreap",
  // };

  return (
    <StyleController.Provider value={{ height, width }}>
      {children}
    </StyleController.Provider>
  );
}
