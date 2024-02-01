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
import { moderateScale } from "../ Metrics";
import { useTranslation } from "react-multi-lang";

export default function TabView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { widthScreen } = useContext(AuthContext);
  const offset = useSharedValue(0);
  const { dimension } = useContext(AuthContext);
  const t = useTranslation();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * (widthScreen / 2) }],
    };
  });

  useEffect(() => {
    if (location.pathname === "/notification/action") {
      offset.value = withTiming(0);
    } else if (location.pathname === "/notification/meeting") {
      offset.value = withTiming(0.95);
    }
  }, [navigate]);

  // console.log(location.pathname);
  return (
    <View style={TabViewStyle.TabViewContainer}>
      <View style={TabViewStyle.TabViewContainerFlex}>
        <Animated.View
          style={[
            TabViewStyle.TabViewContainerFlexAnimation,
            animatedStyles,
            {
              borderRadius: moderateScale(2),
              borderBottomWidth: moderateScale(3),
            },
          ]}
        />
        <TouchableOpacity
          style={[
            location.pathname === "/notification/action"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton,
            { borderBottomWidth: moderateScale(0.5) },
          ]}
          onPress={() => {
            navigate("/notification/action");
            offset.value = withTiming(0);
          }}
        >
          <Text
            style={[
              location.pathname === "/notification/action"
                ? TabViewStyle.TabViewButtonTextActive
                : TabViewStyle.TabViewButtonText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("ACTION")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            location.pathname === "/notification/meeting"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton,
            { borderBottomWidth: moderateScale(0.5) },
          ]}
          onPress={() => {
            navigate("/notification/meeting");
            offset.value = withTiming(0.95);
          }}
        >
          <Text
            style={[
              location.pathname === "/notification/meeting"
                ? TabViewStyle.TabViewButtonTextActive
                : TabViewStyle.TabViewButtonText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("MEETING")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
