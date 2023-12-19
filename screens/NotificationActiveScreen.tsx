import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client";
import moment from "moment";

import NotificationActionStyle from "../styles/NotificationActionStyle.scss";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { GET_NOTIFICATION_CONTACT } from "../graphql/NotificationAction";

export default function NotificationActiveScreen() {
  const { dimension } = useContext(AuthContext);
  const [NotificationData, setNotificationData] = useState([]);
  const [limit, setLimit] = useState(10);

  const { data, refetch } = useQuery(GET_NOTIFICATION_CONTACT, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: (data) => {
      // console.log(data);
      setNotificationData(data?.getNotifications);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View style={NotificationActionStyle.NotificationActionContainer}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {NotificationData?.map((card: any, index: number) => (
          <View style={NotificationActionStyle.ActionCardContainer} key={index}>
            <View style={NotificationActionStyle.ActionCardBodyLeft}>
              <View
                style={
                  card?.title === "Leave Cancel" && dimension !== "sm"
                    ? NotificationActionStyle.ActionCardIconRed
                    : card?.title === "Leave Cancel" && dimension === "sm"
                    ? NotificationActionStyle.ActionCardIconRedSM
                    : dimension === "sm"
                    ? NotificationActionStyle.ActionCardIconSM
                    : NotificationActionStyle.ActionCardIcon
                }
              >
                <Image
                  source={require("../assets/Images/briefcase.png")}
                  style={
                    dimension === "sm"
                      ? NotificationActionStyle.ActionIconSM
                      : NotificationActionStyle.ActionIcon
                  }
                />
              </View>
            </View>
            <View style={NotificationActionStyle.ActionCardBodyRight}>
              <Text
                style={
                  card?.title === "Leave Cancel" && dimension !== "sm"
                    ? NotificationActionStyle.ActionLeaveTitleRed
                    : card?.title === "Leave Cancel" && dimension === "sm"
                    ? NotificationActionStyle.ActionLeaveTitleRedSM
                    : dimension === "sm"
                    ? NotificationActionStyle.ActionLeaveTitleSM
                    : NotificationActionStyle.ActionLeaveTitle
                }
              >
                {card?.title}
              </Text>
              <Text
                style={
                  card?.title === "Leave Cancel" && dimension !== "sm"
                    ? NotificationActionStyle.ActionDatTimeRed
                    : card?.title === "Leave Cancel" && dimension === "sm"
                    ? NotificationActionStyle.ActionDatTimeRedSM
                    : dimension === "sm"
                    ? NotificationActionStyle.ActionDatTimeSM
                    : NotificationActionStyle.ActionDatTime
                }
              >
                {moment(card?.date).format("DD MMM YY")} | {card?.time}
              </Text>
              <Text
                style={
                  card?.title === "Leave Cancel" && dimension !== "sm"
                    ? NotificationActionStyle.ActionCommentRed
                    : card?.title === "Leave Cancel" && dimension === "sm"
                    ? NotificationActionStyle.ActionCommentRedSM
                    : dimension === "sm"
                    ? NotificationActionStyle.ActionCommentSM
                    : NotificationActionStyle.ActionComment
                }
              >
                {card?.body}
              </Text>
            </View>
          </View>
        ))}
        {NotificationData.length >= limit ? (
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
            <Text style={{ fontFamily: "Kantumruy-Bold", color: "#3c6efb" }}>
              {"see more"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
