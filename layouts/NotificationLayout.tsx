import { Platform, StatusBar } from "react-native";
import { View } from "react-native";
import { Outlet } from "react-router-native";
import LayoutStyle from "../styles/LayoutStyle.scss";
import Tabview from "../includes/TabView";

export default function NotificationLayout() {
  return (
    <View style={LayoutStyle.NotificationLayoutContainer}>
      <Tabview />
      <View style={LayoutStyle.NotificationLayoutBodyContainer}>
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        />
        <Outlet />
      </View>
    </View>
  );
}
