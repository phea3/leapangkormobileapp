import { ActivityIndicator, Keyboard, Text, View } from "react-native";
import HomeStyle from "../styles/HomeStyle.scss";
import moment from "moment";
import { Outlet } from "react-router-native";
import { useEffect, useState } from "react";
import KeyboardDismissableArea from "../functions/KeyboardDismissableArea";
import { useQuery } from "@apollo/client";
import { GETEMPLOYEELEAVEINFO } from "../graphql/GetEmployeeLeaveInfo";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Actions = [
  {
    title: "Annual leave",
  },
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
  const [load, setLoad ] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoad(false)
    }, 100);
  }, [])

  const { data: leaveData, refetch: leavRefetch } = useQuery(
    GETEMPLOYEELEAVEINFO,
    {
      pollInterval: 2000,
      variables: {
        employeeId: uid ? uid : "",
      },
      onCompleted: ({ getEmployeeLeaveInfo }) => {
        // console.log(getEmployeeLeaveInfo);
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
              style={
                dimension === "sm"
                  ? HomeStyle.HomeSelectDateTextSM
                  : HomeStyle.HomeSelectDateText
              }
            >
              {moment(new Date()).format("MMMM, YYYY")}
            </Text>
          </View>
          <View style={HomeStyle.HomeBoxesContainer}>
            {Actions.map((action: any, index: number) => (
              <View
                style={
                  dimension === "sm"
                    ? HomeStyle.HomeBoxContainerSM
                    : HomeStyle.HomeBoxContainer
                }
                key={index}
              >
                <View
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeBoxCircleSM
                      : HomeStyle.HomeBoxCircle
                  }
                >
                  <Text
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeBoxInSideCircleTextSM
                        : HomeStyle.HomeBoxInSideCircleText
                    }
                  >
                    {action.title === "Annual leave"
                      ? leaveData?.getEmployeeLeaveInfo?.al
                        ? leaveData?.getEmployeeLeaveInfo?.al
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
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeBoxCircleTextSM
                      : HomeStyle.HomeBoxCircleText
                  }
                >
                  {action.title}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
      { load ? 
        <View style={HomeStyle.HomeContentContainer}>
          <ActivityIndicator size={"small"}/>
        </View> :  
        <View style={HomeStyle.HomeContentContainer}>
          <Outlet />
        </View>
      }
    </View>
  );
}