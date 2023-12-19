import { Text, TouchableOpacity, View } from "react-native";
import TabViewStyle from "../styles/TabView.scss";
import { useLocation, useNavigate } from "react-router-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function TabView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { widthScreen } = useContext(AuthContext);
  const offset = useSharedValue(0);
  const { dimension } = useContext(AuthContext);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * (widthScreen / 2) }],
    };
  });

  useEffect(() => {
    if (location.pathname === "/notification") {
      offset.value = withTiming(0);
    } else if (location.pathname === "/notification/meeting") {
      offset.value = withTiming(0.95);
    }
  }, [navigate]);

  return (
    <View style={TabViewStyle.TabViewContainer}>
      <View style={TabViewStyle.TabViewContainerFlex}>
        <Animated.View
          style={[TabViewStyle.TabViewContainerFlexAnimation, animatedStyles]}
        />
        <TouchableOpacity
          style={
            location.pathname === "/notification/action"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton
          }
          onPress={() => {
            navigate("/notification/action");
            offset.value = withTiming(0);
          }}
        >
          <Text
            style={
              location.pathname === "/notification/action" && dimension === "sm"
                ? TabViewStyle.TabViewButtonTextActiveSM
                : location.pathname === "/notification/action" &&
                  dimension !== "sm"
                ? TabViewStyle.TabViewButtonTextActive
                : dimension === "sm"
                ? TabViewStyle.TabViewButtonTextSM
                : TabViewStyle.TabViewButtonText
            }
          >
            ACTION
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            location.pathname === "/notification/meeting"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton
          }
          onPress={() => {
            navigate("/notification/meeting");
            offset.value = withTiming(0.95);
          }}
        >
          <Text
            style={
              location.pathname === "/notification/meeting" &&
              dimension === "sm"
                ? TabViewStyle.TabViewButtonTextActiveSM
                : location.pathname === "/notification/meeting" &&
                  dimension !== "sm"
                ? TabViewStyle.TabViewButtonTextActive
                : dimension === "sm"
                ? TabViewStyle.TabViewButtonTextSM
                : TabViewStyle.TabViewButtonText
            }
          >
            MEETING
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
