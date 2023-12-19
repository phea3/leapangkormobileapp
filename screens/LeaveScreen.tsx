import { useState, useEffect, useContext } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useQuery } from "@apollo/client";

import LeaveStyle from "../styles/LeaveStyle.scss";
import { GET_LEAVE_LIST } from "../graphql/RequestLeave";
import { AuthContext } from "../Context/AuthContext";

export default function LeaveScreen() {
  const navigate = useNavigate();
  const [leavListData, setLeaveData] = useState([]);
  const [limit, setLimit] = useState(10);
  const { dimension } = useContext(AuthContext);

  const { data, refetch } = useQuery(GET_LEAVE_LIST, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: (data) => {
      // console.log(data);
      setLeaveData(data?.getLeaveListForMobile);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View style={LeaveStyle.LeaveContainer}>
      <View style={LeaveStyle.LeaveBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={LeaveStyle.LeaveBackButton}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveBackButtonIconSM
                : LeaveStyle.LeaveBackButtonIcon
            }
          />
          <Text
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveBackButtonTitleSM
                : LeaveStyle.LeaveBackButtonTitle
            }
          >
            Leave Screen
          </Text>
        </TouchableOpacity>
      </View>

      <View style={LeaveStyle.LeaveTitlesContainer}>
        <View style={LeaveStyle.LeaveTitleLeftContainer}>
          <Text
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveTitleTextSM
                : LeaveStyle.LeaveTitleText
            }
          >
            Discription
          </Text>
        </View>
        <View style={LeaveStyle.LeaveTitleLeftContainer}>
          <Text
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveTitleTextSM
                : LeaveStyle.LeaveTitleText
            }
          >
            Date
          </Text>
        </View>
        <View style={LeaveStyle.LeaveTitleContainer}>
          <Text
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveTitleTextSM
                : LeaveStyle.LeaveTitleText
            }
          >
            Shift
          </Text>
        </View>
        <View style={LeaveStyle.LeaveTitleContainer}>
          <Text
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveTitleTextSM
                : LeaveStyle.LeaveTitleText
            }
          >
            Status
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {leavListData?.map((attendance: any, index: number) => (
          <View style={LeaveStyle.LeaveBodyContainer} key={index}>
            <View style={LeaveStyle.LeaveTitleLeftContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveBodyTextSM
                    : LeaveStyle.LeaveBodyText
                }
                numberOfLines={1}
              >
                {attendance?.description}
              </Text>
            </View>
            <View style={LeaveStyle.LeaveTitleLeftContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveBodyTextSM
                    : LeaveStyle.LeaveBodyText
                }
              >
                {attendance?.date}
              </Text>
            </View>
            <View style={LeaveStyle.LeaveTitleContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveBodyTextSM
                    : LeaveStyle.LeaveBodyText
                }
              >
                {attendance?.shife}
              </Text>
            </View>
            <View style={LeaveStyle.LeaveTitleContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveBodyTextSM
                    : LeaveStyle.LeaveBodyText
                }
              >
                {attendance?.status}
              </Text>
            </View>
          </View>
        ))}
        {leavListData?.length >= limit ? (
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

      <View></View>
    </View>
  );
}
