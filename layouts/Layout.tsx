import { View, Text, SafeAreaView, Alert, ImageBackground } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "../includes/Header";
import LayoutStyle from "../styles/LayoutStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_MOBILE_LOGIN } from "../graphql/GetUserMobileLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate, useLocation } from "react-router-native";
import useLoginUser from "../Hook/useLoginUser";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import NetInfo from "@react-native-community/netinfo";
import { GET_EMPLOYEEBYID } from "../graphql/GetEmployeeById";

const Layout = ({ expoPushToken }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { heightScreen } = useContext(AuthContext);
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();

  const isConnection = useSharedValue("no");
  const offheight = useSharedValue(0);
  const color = useSharedValue("red");
  const [connection, setConnection] = useState(false);

  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);
  // console.log(expoPushToken?.data);

  const { data: UserData, refetch: UserRefetch } = useQuery(
    GET_USER_MOBILE_LOGIN,
    {
      pollInterval: 2000,
      variables: {
        token: expoPushToken?.data ? expoPushToken?.data : "",
      },
      onCompleted: ({ getUserMobileLogin }) => {
        // console.log("getUserMobileLogin", getUserMobileLogin);
        if (getUserMobileLogin) {
          onStateChange(getUserMobileLogin);
        }
        // console.log(expoPushToken?.data);
        //========= Set Online Mode =========
        if (connection === true) {
          offheight.value = withTiming(10);
          color.value = withTiming("#4CBB17");
          isConnection.value = withTiming("yes");
          setTimeout(() => {
            offheight.value = withTiming(0);
          }, 1000);
        }
      },

      onError(error) {
        // console.log("getUserMobileLogin", error?.message);
        //========= Set Offline Mode =========
        if (connection === false) {
          offheight.value = withTiming(10);
          color.value = withTiming("red");
          isConnection.value = withTiming("no");
        }
        if (error?.message === "Not Authorized") {
          Alert.alert("Opp! Your session has been expired.", "", [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.removeItem("@userToken");
                await AsyncStorage.setItem("@userUid", JSON.stringify(null));
                dispatch({
                  type: REDUCER_ACTIONS.LOGOUT,
                });
                navigate("/");
              },
            },
          ]);
        }
      },
    }
  );

  const { data: employeeData, refetch: employeeRefetch } = useQuery(
    GET_EMPLOYEEBYID,
    {
      variables: {
        id: UserData?.getUserMobileLogin?.user?._id,
      },
      onCompleted: ({ getEmployeeById }) => {
        if (getEmployeeById?.workingStatus === "resign") {
          Alert.alert("Opp! Your session has been expired.", "", [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.removeItem("@userToken");
                await AsyncStorage.setItem("@userUid", JSON.stringify(null));
                dispatch({
                  type: REDUCER_ACTIONS.LOGOUT,
                });
                navigate("/");
              },
            },
          ]);
        }
      },
    }
  );

  useEffect(() => {
    UserRefetch();
  }, [expoPushToken?.data, location.pathname]);

  useEffect(() => {
    // console.log(UserData?.getUserMobileLogin?.user?._id);
    employeeRefetch();
  }, [UserData?.getUserMobileLogin?.user?._id]);

  //============== Detect Connection App ================
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withSpring(offheight.value),
      backgroundColor: withSpring(color.value),
    };
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (connection !== state.isConnected) {
        setConnection(state.isConnected ? true : false);
        if (state.isConnected === true && isConnection.value === "no") {
          offheight.value = withTiming(10);
          color.value = withTiming("#4CBB17");
          isConnection.value = withTiming("yes");
          setTimeout(() => {
            offheight.value = withTiming(0);
          }, 1000);
        } else if (
          (state.isConnected === false && isConnection.value === "yes") ||
          (state.isConnected === false && isConnection.value === "no") ||
          (state.isConnected === false && isConnection.value === "NaN")
        ) {
          offheight.value = withTiming(10);
          color.value = withTiming("red");
          isConnection.value = withTiming("no");
        } else if (state.isConnected === true && isConnection.value === "yes") {
          setTimeout(() => {
            isConnection.value = withTiming("no");
          }, 500);
        }
      }
    });
    return () => {
      unsubscribe;
    };
  }, [connection, UserData?.getUserMobileLogin]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          location.pathname === "/notification" ||
          location.pathname === "/notification/action" ||
          location.pathname === "/notification/meeting"
            ? "#ffffff"
            : "#177A02",
        justifyContent: "flex-end",
      }}
    >
      <View style={LayoutStyle.LayoutCoverFooter} />
      <ImageBackground
        source={require("../assets/Images/insidebackground.png")}
        resizeMode="cover"
        style={LayoutStyle.LoginLayoutContainer}
      >
        <View style={LayoutStyle.LayoutContainer}>
          <Header />
          <Animated.View
            style={[
              {
                width: "100%",
                height: 0,
              },
              animatedStyles,
            ]}
          />
          <View style={LayoutStyle.LayoutOutletContainer}>
            <Outlet />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Layout;
