import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import HomeStyle from "../styles/HomeStyle.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_EMPLOYEEONHOLIDAY } from "../graphql/GetEmployeeOnHoliday";
import moment from "moment";
import { moderateScale } from "../ Metrics";
import * as Animatable from "react-native-animatable";

const Features = [
  {
    title: "Leaves",
    icon: require("../assets/Images/blogger.png"),
  },
  {
    title: "Check-In/Out",
    icon: require("../assets/Images/completed-task.png"),
  },
  {
    title: "Attendances",
    icon: require("../assets/Images/check-list.png"),
  },
  {
    title: "Timeoff",
    icon: require("../assets/Images/day-off.png"),
  },
  {
    title: "Payslip",
    icon: require("../assets/Images/conversation.png"),
  },
];

export default function HomeMainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const leaves = Array.from({ length: 20 }, (_, index) => index);
  const { dimension } = useContext(AuthContext);
  const [holiData, setHolidata] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const { refetch: HoliRefetch } = useQuery(GET_EMPLOYEEONHOLIDAY, {
    // pollInterval: 2000,
    onCompleted(GetEmployeeOnHoliday) {
      // console.log(holiData);
      setHolidata(GetEmployeeOnHoliday?.getEmployeeOnHoliday);
    },
    onError(error) {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    HoliRefetch();
  }, [location.pathname]);

  return (
    <View
      style={[
        HomeStyle.HomeMainContentContainer,
        {
          borderTopWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
        },
      ]}
    >
      <View style={HomeStyle.HomeFeaturesTitle}>
        <Text
          style={[
            HomeStyle.HomeFeaturesTitleText,
            { padding: moderateScale(15), fontSize: moderateScale(14) },
          ]}
        >
          FEATURES
        </Text>
      </View>
      <View
        style={[
          HomeStyle.HomeFeaturesBoxesContaienr,
          { height: moderateScale(100) },
        ]}
      >
        <ScrollView
          horizontal
          style={{ width: "100%" }}
          showsHorizontalScrollIndicator={false}
        >
          {Features.map((feature: any, index: number) => (
            <TouchableOpacity
              onPress={() => {
                if (feature.title === "Leaves") {
                  navigate("/leave");
                } else if (feature.title === "Check-In/Out") {
                  navigate("/check");
                } else if (feature.title === "Attendances") {
                  navigate("/attendance");
                } else if (feature.title === "Payslip") {
                  navigate("/meeting");
                } else if (feature.title === "Timeoff") {
                  navigate("/timeoff");
                }
              }}
              style={[
                HomeStyle.HomeFeaturesBoxContaienr,
                { width: moderateScale(100), height: moderateScale(100) },
              ]}
              key={index}
            >
              <View
                style={[
                  HomeStyle.HomeBoxStyle,
                  {
                    height: moderateScale(90),
                    borderWidth: moderateScale(1.5),
                    borderRadius: moderateScale(10),
                  },
                ]}
              >
                <Animatable.Image
                  animation={"bounce"}
                  source={feature.icon}
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                />
                <Text
                  style={[
                    HomeStyle.HomeFeaturesBoxTitle,
                    { fontSize: moderateScale(10) },
                  ]}
                >
                  {feature.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={[
          HomeStyle.HomeLeaveRequestContainer,
          {
            padding: moderateScale(10),
            borderRadius: moderateScale(10),
            marginBottom: moderateScale(10),
          },
        ]}
        onPress={() => navigate("/home/leave")}
      >
        <Text
          style={[
            HomeStyle.HomeLeaveRequestText,
            { fontSize: moderateScale(14) },
          ]}
        >
          REQUEST LEAVE
        </Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        style={{
          width: "95%",
          backgroundColor: "#f8f8f8",
          borderRadius: moderateScale(15),
          borderWidth: moderateScale(1),
          borderColor: "#dcdcdc",
        }}
      >
        <View
          style={[
            HomeStyle.HomeHolidayTopContainer,
            { padding: moderateScale(10) },
          ]}
        >
          <Text
            style={[
              HomeStyle.HomeFeaturesTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            Employee on holiday
          </Text>
        </View>

        {holiData
          ? holiData.map((leave: any, index: number) => (
              <Animatable.View
                animation={load ? "fadeInUp" : "fadeInUp"}
                style={[
                  HomeStyle.HomeHolidayCardContainer,
                  { padding: moderateScale(10) },
                ]}
                key={index}
              >
                <Animatable.Image
                  animation={"fadeIn"}
                  source={
                    leave?.profileImage
                      ? { uri: leave?.profileImage }
                      : require("../assets/Images/user.png")
                  }
                  style={[
                    HomeStyle.HomeHolidayProfileImage,
                    {
                      width: moderateScale(40),
                      height: moderateScale(40),
                      marginRight: moderateScale(10),
                      borderWidth: moderateScale(1),
                    },
                  ]}
                />
                <View style={HomeStyle.HomeHolidayTitleContainer}>
                  <Text
                    style={[
                      HomeStyle.HomeHolidayTitle1,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {leave?.latinName}
                  </Text>
                  <Text
                    style={[
                      HomeStyle.HomeHolidayTitle3,
                      { fontSize: moderateScale(12) },
                    ]}
                    numberOfLines={1}
                  >
                    {leave?.reason}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      padding: moderateScale(4),
                      backgroundColor: "#4cbb17",
                      alignItems: "center",
                      borderRadius: moderateScale(8),
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: moderateScale(10),
                          textAlign: "right",
                          fontFamily: "Kantumruy-Regular",
                          color: "white",
                        },
                      ]}
                    >
                      {leave?.shiftOff ? leave?.shiftOff : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={[
                        HomeStyle.HomeHolidayTitle2,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      {leave?.dateLeave ? leave?.dateLeave : ""}
                    </Text>
                  </View>
                </View>
              </Animatable.View>
            ))
          : null}
      </ScrollView>
    </View>
  );
}
