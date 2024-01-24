import { ActivityIndicator, Image, Keyboard, Text, View } from "react-native";
import HomeStyle from "../styles/HomeStyle.scss";
import moment from "moment";
import { Outlet } from "react-router-native";
import { useEffect, useState } from "react";
import KeyboardDismissableArea from "../functions/KeyboardDismissableArea";
import { useQuery } from "@apollo/client";
import { GETEMPLOYEELEAVEINFO } from "../graphql/GetEmployeeLeaveInfo";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";

const Actions = [
  // {
  //   title: "Day Off",
  // },
  {
    title: "Permission",
  },
  {
    title: "Late",
  },
  {
    title: "Fine",
  },
];

export default function HomeScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { uid } = useContext(AuthContext);
  const { dimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 100);
  }, []);

  const { data: leaveData, refetch: leavRefetch } = useQuery(
    GETEMPLOYEELEAVEINFO,
    {
      // pollInterval: 2000,
      variables: {
        employeeId: uid ? uid : "",
      },
      onCompleted: ({ getEmployeeLeaveInfo }) => {
        // console.log("getEmployeeLeaveInfo", getEmployeeLeaveInfo);
      },
      onError(error) {
        console.log(error?.message);
      },
    }
  );
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={HomeStyle.HomeContainer}>
      <KeyboardDismissableArea />
      {!isKeyboardVisible ? (
        <>
          <View style={HomeStyle.HomeSelectDateContainer}>
            <Text
              style={[
                HomeStyle.HomeSelectDateText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {moment(new Date()).format("MMMM, YYYY")}
            </Text>
          </View>
          <View style={HomeStyle.HomeBoxesContainer}>
            {Actions.map((action: any, index: number) => (
              <View
                style={[
                  HomeStyle.HomeBoxContainer,
                  { height: moderateScale(120) },
                ]}
                key={index}
              >
                <View
                  style={[
                    HomeStyle.HomeBoxCircle,
                    {
                      width: moderateScale(70),
                      height: moderateScale(70),
                      borderWidth: moderateScale(2),
                    },
                  ]}
                >
                  <Text
                    style={[
                      HomeStyle.HomeBoxInSideCircleText,
                      { fontSize: moderateScale(20) },
                    ]}
                  >
                    {action.title === "Day Off"
                      ? leaveData?.getEmployeeLeaveInfo?.dayOfTimeOff
                        ? leaveData?.getEmployeeLeaveInfo?.dayOfTimeOff
                        : "0"
                      : action.title === "Permission"
                      ? leaveData?.getEmployeeLeaveInfo?.permission
                        ? leaveData?.getEmployeeLeaveInfo?.permission
                        : "0"
                      : action.title === "Late"
                      ? leaveData?.getEmployeeLeaveInfo?.late
                        ? leaveData?.getEmployeeLeaveInfo?.late
                        : "0"
                      : action.title === "Fine"
                      ? leaveData?.getEmployeeLeaveInfo?.fine
                        ? "$" + leaveData?.getEmployeeLeaveInfo?.fine
                        : "$0"
                      : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    HomeStyle.HomeBoxCircleText,
                    { fontSize: moderateScale(10) },
                  ]}
                >
                  {action.title}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
      {load ? (
        <View
          style={[
            HomeStyle.HomeContentContainer,
            {
              borderTopLeftRadius: moderateScale(15),
              borderTopRightRadius: moderateScale(15),
            },
          ]}
        >
          <Image
            source={require("../assets/Images/loader-1.gif")}
            style={{
              width: moderateScale(100),
              height: moderateScale(100),
            }}
          />
        </View>
      ) : (
        <View
          style={[
            HomeStyle.HomeContentContainer,
            {
              borderTopLeftRadius: moderateScale(15),
              borderTopRightRadius: moderateScale(15),
            },
          ]}
        >
          <Outlet />
        </View>
      )}
    </View>
  );
}
