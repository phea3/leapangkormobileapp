import {
  Navigate,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router-native";
import LoadingScreen from "./screens/LoadingScreen";
import Layout from "./layouts/Layout";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import { useContext, useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import { AuthContext } from "./Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLoginUser from "./Hook/useLoginUser";
import { Dimensions, Platform } from "react-native";
import HomeMainScreen from "./screens/HomeMainScreen";
import HomeLeaveScreen from "./screens/HomeLeaveScreen";
import LeaveScreen from "./screens/LeaveScreen";
import { usePushNotifications } from "./usePushNotifications";
import ChecKAttendance from "./screens/CheckAttendance";
import AttendanceScreen from "./screens/AttendanceScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import * as Location from "expo-location";
import NotificationLayout from "./layouts/NotificationLayout";
import NotificationActiveScreen from "./screens/NotificationActiveScreen";
import NotificationMeetingScreen from "./screens/NotificationMeetingScreen";
import MeetingScreen from "./screens/MeetingScreen";
import LoginLayout from "./layouts/LoginLayout";

export default function Router() {
  const { expoPushToken, notificationResponse } = usePushNotifications();
  const navigate = useNavigate();
  const local = useLocation();
  const [load, setLoad] = useState(true);
  const { token, defineDimension } = useContext(AuthContext);
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  useEffect(() => {
    async function getLocalStorage() {
      let userToken = await AsyncStorage.getItem("@userToken");
      let userUid = await AsyncStorage.getItem("@userUid");
      //
      if (userToken && userUid) {
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: userToken,
            uid: userUid,
          },
        });
      } else {
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: "",
            uid: "",
          },
        });
      }

      defineDimension({
        dimension: "",
        widthscreen: width,
        heightscreen: height,
      });
      //
    }
    getLocalStorage();
  }, []);

  const [locate, setLocation] = useState<Location.LocationObject | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    // Get the current location
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMsg("Error getting location");
    }
  }

  useEffect(() => {
    async function getIDUserLog() {
      if (
        notificationResponse?.notification?.request?.content?.data?.type ===
        "leave"
      ) {
        setTimeout(() => {
          navigate("/notification/action");
        }, 500);
      } else if (
        notificationResponse?.notification?.request?.content?.data?.type ===
          "leave" ||
        notificationResponse?.notification?.request?.content?.data?.type ===
          "Pleave"
      ) {
        // console.log(notificationResponse?.notification?.request?.content);
        setTimeout(() => {
          navigate("/notification");
        }, 500);
      }
    }

    getIDUserLog();
  }, [notificationResponse]);

  useEffect(() => {
    getLocation();
    // console.log("first get location", locate);
  }, []);

  // console.log(local.pathname);
  // console.log(token);
  const loadScreen = useRoutes([
    { path: "/", element: <LoadingScreen /> },
    { path: "/*", element: <NotFoundScreen /> },
  ]);

  const Content = useRoutes([
    { path: "/login", element: <Navigate to="/" /> },
    {
      path: "/",
      element: <Layout expoPushToken={expoPushToken} />,
      children: [
        { path: "/", element: <Navigate to="/home" /> },
        {
          path: "/home",
          element: <HomeScreen />,
          children: [
            { path: "/home", element: <Navigate to="/home/main" /> },
            { path: "/home/main", element: <HomeMainScreen /> },
            { path: "/home/leave", element: <HomeLeaveScreen /> },
          ],
        },
        { path: "/leave", element: <LeaveScreen /> },
        {
          path: "/check",
          element: <ChecKAttendance locate={locate} />,
        },
        { path: "/attendance", element: <AttendanceScreen /> },
        { path: "/profile", element: <ProfileScreen /> },
        { path: "/meeting", element: <MeetingScreen /> },
        {
          path: "/notification",
          element: <NotificationLayout />,
          children: [
            {
              path: "/notification",
              element: <Navigate to="/notification/action" />,
            },
            {
              path: "/notification/action",
              element: <NotificationActiveScreen />,
            },
            {
              path: "/notification/meeting",
              element: <NotificationMeetingScreen />,
            },
          ],
        },
        { path: "/*", element: <NotFoundScreen /> },
      ],
    },
  ]);

  const Login = useRoutes([
    {
      path: "/login",
      element: <Navigate to="/" />,
    },
    {
      path: "/",
      element: <LoginLayout />,

      children: [
        { path: "/", element: <LoginScreen /> },
        { path: "/login", element: <LoginScreen /> },
        { path: "/forgot-pass", element: <ForgotPasswordScreen /> },
        { path: "/*", element: <NotFoundScreen /> },
      ],
    },
  ]);

  // if (locate === null && !errorMsg) {
  //   return loadScreen;
  // } else {
  if (token !== "" && token !== undefined) {
    return Content;
  } else {
    return Login;
  }
  // }
}
