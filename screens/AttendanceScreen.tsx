import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AttendanceStyle from "../styles/AttendanceStyle.scss";
import { useNavigate } from "react-router-native";
import { useQuery } from "@apollo/client";
import { GETATTENDANCEMOBILE } from "../graphql/getAttendanceMobile";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../Context/AuthContext";

export default function AttendanceScreen() {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const { dimension } = useContext(AuthContext);

  const { data: AttendanceData, refetch: AttendanceRefetch } = useQuery(
    GETATTENDANCEMOBILE,
    {
      pollInterval: 2000,
      variables: {
        limit: limit,
      },
      onCompleted(getAttendanceMobile) {
        console.log(getAttendanceMobile);
      },
      onError(error) {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    AttendanceRefetch();
  }, []);

  return (
    <View style={AttendanceStyle.AttendanceContainer}>
      <View style={AttendanceStyle.AttendanceBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={AttendanceStyle.AttendanceBackButton}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={
              dimension === "sm"
                ? AttendanceStyle.AttendanceBackButtonIconSM
                : AttendanceStyle.AttendanceBackButtonIcon
            }
          />
          <Text
            style={
              dimension === "sm"
                ? AttendanceStyle.AttendanceBackButtonTitleSM
                : AttendanceStyle.AttendanceBackButtonTitle
            }
          >
            Attendance Screen
          </Text>
        </TouchableOpacity>
      </View>

      <View style={AttendanceStyle.AttendanceTitlesContainer}>
        <View style={AttendanceStyle.AttendanceDateTitleContainer}>
          <Text
            style={
              dimension === "sm"
                ? AttendanceStyle.AttendanceTitleTextSM
                : AttendanceStyle.AttendanceTitleText
            }
          >
            Date
          </Text>
        </View>
        <View style={AttendanceStyle.AttendanceTitleContainer}>
          <Text
            style={
              dimension === "sm"
                ? AttendanceStyle.AttendanceTitleTextSM
                : AttendanceStyle.AttendanceTitleText
            }
          >
            Morning
          </Text>
        </View>
        <View style={AttendanceStyle.AttendanceTitleContainer}>
          <Text
            style={
              dimension === "sm"
                ? AttendanceStyle.AttendanceTitleTextSM
                : AttendanceStyle.AttendanceTitleText
            }
          >
            Afternoon
          </Text>
        </View>
        <View style={AttendanceStyle.AttendanceFineTitleContainer}>
          <Text
            style={
              dimension === "sm"
                ? AttendanceStyle.AttendanceTitleTextSM
                : AttendanceStyle.AttendanceTitleText
            }
          >
            Fine
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {AttendanceData?.getAttendanceMobile.map(
          (attendance: any, index: number) => (
            <View style={AttendanceStyle.AttendanceBodyContainer} key={index}>
              <View style={AttendanceStyle.AttendanceDateTitleContainer}>
                <Text
                  style={
                    dimension === "sm"
                      ? AttendanceStyle.AttendanceBodyTextSM
                      : AttendanceStyle.AttendanceBodyText
                  }
                >
                  {moment(attendance?.date).format("DD MMM YY")}
                </Text>
              </View>
              <View style={AttendanceStyle.AttendanceTitleContainer}>
                <Text
                  style={
                    dimension === "sm"
                      ? AttendanceStyle.AttendanceBodyTextSM
                      : AttendanceStyle.AttendanceBodyText
                  }
                >
                  {attendance?.morning}
                </Text>
              </View>
              <View style={AttendanceStyle.AttendanceTitleContainer}>
                <Text
                  style={
                    dimension === "sm"
                      ? AttendanceStyle.AttendanceBodyTextSM
                      : AttendanceStyle.AttendanceBodyText
                  }
                >
                  {attendance?.afternoon}
                </Text>
              </View>
              <View style={AttendanceStyle.AttendanceFineTitleContainer}>
                {attendance?.fine > 0 ? (
                  <Text
                    style={
                      dimension === "sm"
                        ? AttendanceStyle.AttendanceBodyFineTextSM
                        : AttendanceStyle.AttendanceBodyFineText
                    }
                  >
                    ${attendance?.fine}
                  </Text>
                ) : (
                  <Text
                    style={
                      dimension === "sm"
                        ? AttendanceStyle.AttendanceBodyTextSM
                        : AttendanceStyle.AttendanceBodyText
                    }
                  >
                    ${attendance?.fine}
                  </Text>
                )}
              </View>
            </View>
          )
        )}
        {AttendanceData?.getAttendanceMobile.length >= limit ? (
          <TouchableOpacity
            onPress={() => {
              setLimit(10 + limit);
            }}
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                fontFamily: "Kantumruy-Bold",
                color: "#3c6efb",
                fontSize: dimension === "sm" ? 12 : 16,
              }}
            >
              {"see more"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
