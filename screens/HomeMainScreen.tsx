import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import HomeStyle from "../styles/HomeStyle.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_EMPLOYEEONHOLIDAY } from "../graphql/GetEmployeeOnHoliday";
import moment from "moment";

const Features = [
  {
    title: "Leave Request",
    icon: require("../assets/Images/blogger.png"),
  },
  {
    title: "Check-In/Out",
    icon: require("../assets/Images/completed-task.png"),
  },
  {
    title: "Attendance",
    icon: require("../assets/Images/check-list.png"),
  },
  {
    title: "Meeting",
    icon: require("../assets/Images/conversation.png"),
  },
];

export default function HomeMainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const leaves = Array.from({ length: 20 }, (_, index) => index);
  const { dimension } = useContext(AuthContext);
  const [holiData, setHolidata] = useState([]);

  const { refetch: HoliRefetch } = useQuery(GET_EMPLOYEEONHOLIDAY, {
    pollInterval: 2000,
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
    <View style={HomeStyle.HomeMainContentContainer}>
      <View style={HomeStyle.HomeFeaturesTitle}>
        <Text
          style={
            dimension === "sm"
              ? HomeStyle.HomeFeaturesTitleTextSM
              : HomeStyle.HomeFeaturesTitleText
          }
        >
          Features
        </Text>
      </View>
      <View
        style={
          dimension === "sm"
            ? HomeStyle.HomeFeaturesBoxesContaienrSM
            : HomeStyle.HomeFeaturesBoxesContaienr
        }
      >
        {Features.map((feature: any, index: number) => (
          <TouchableOpacity
            onPress={() => {
              if (feature.title === "Leave Request") {
                navigate("/leave");
              } else if (feature.title === "Check-In/Out") {
                navigate("/check");
              } else if (feature.title === "Attendance") {
                navigate("/attendance");
              } else if (feature.title === "Meeting") {
                navigate("/meeting");
              }
            }}
            style={
              dimension === "sm"
                ? HomeStyle.HomeFeaturesBoxContaienrSM
                : HomeStyle.HomeFeaturesBoxContaienr
            }
            key={index}
          >
            <View
              style={
                dimension === "sm"
                  ? HomeStyle.HomeBoxStyleSM
                  : HomeStyle.HomeBoxStyle
              }
            >
              <Image
                source={feature.icon}
                style={
                  dimension === "sm"
                    ? HomeStyle.HomeFeaturesIconSM
                    : HomeStyle.HomeFeaturesIcon
                }
              />
              <Text
                style={
                  dimension === "sm"
                    ? HomeStyle.HomeFeaturesBoxTitleSM
                    : HomeStyle.HomeFeaturesBoxTitle
                }
              >
                {feature.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={
          dimension === "sm"
            ? HomeStyle.HomeLeaveRequestContainerSM
            : HomeStyle.HomeLeaveRequestContainer
        }
        onPress={() => navigate("/home/leave")}
      >
        <Text
          style={
            dimension === "sm"
              ? HomeStyle.HomeLeaveRequestTextSM
              : HomeStyle.HomeLeaveRequestText
          }
        >
          Leave Request
        </Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        style={{
          width: "92%",
          backgroundColor: "#f8f8f8",
          borderRadius: 15,
        }}
      >
        <View
          style={
            dimension === "sm"
              ? HomeStyle.HomeHolidayTopContainerSM
              : HomeStyle.HomeHolidayTopContainer
          }
        >
          <Text
            style={
              dimension === "sm"
                ? HomeStyle.HomeFeaturesTitleTextSM
                : HomeStyle.HomeFeaturesTitleText
            }
          >
            Employee on holiday
          </Text>
        </View>

        {holiData
          ? holiData.map((leave: any, index: number) => (
              <View
                style={
                  dimension === "sm"
                    ? HomeStyle.HomeHolidayCardContainerSM
                    : HomeStyle.HomeHolidayCardContainer
                }
                key={index}
              >
                <Image
                  source={
                    leave?.profileImage
                      ? { uri: leave?.profileImage }
                      : require("../assets/Images/user.png")
                  }
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeHolidayProfileImageSM
                      : HomeStyle.HomeHolidayProfileImage
                  }
                />
                <View style={HomeStyle.HomeHolidayTitleContainer}>
                  <Text
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeHolidayTitle1SM
                        : HomeStyle.HomeHolidayTitle1
                    }
                  >
                    {leave?.latinName}
                  </Text>
                  <Text
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeHolidayTitle3SM
                        : HomeStyle.HomeHolidayTitle3
                    }
                    numberOfLines={1}
                  >
                    {leave?.reason}
                  </Text>
                </View>
                <Text
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeHolidayTitle2SM
                      : HomeStyle.HomeHolidayTitle2
                  }
                >
                  {leave?.dateLeave ? leave?.dateLeave : ""}
                </Text>
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
}
