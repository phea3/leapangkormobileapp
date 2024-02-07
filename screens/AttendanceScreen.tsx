import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AttendanceStyle from "../styles/AttendanceStyle.scss";
import { useNavigate } from "react-router-native";
import { useQuery } from "@apollo/client";
import { GETATTENDANCEMOBILE } from "../graphql/getAttendanceMobile";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../Context/AuthContext";
import HomeStyle from "../styles/HomeStyle.scss";
import * as Animatable from "react-native-animatable";
import { moderateScale } from "../ Metrics";
import { useTranslation } from "react-multi-lang";

export default function AttendanceScreen() {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const { dimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const t = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const { data: AttendanceData, refetch: AttendanceRefetch } = useQuery(
    GETATTENDANCEMOBILE,
    {
      // pollInterval: 2000,
      variables: {
        limit: limit,
      },
      onCompleted(data) {
        // console.log(data);
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
    <View
      style={[
        AttendanceStyle.AttendanceContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
        },
      ]}
    >
      <View style={AttendanceStyle.AttendanceBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={[
            AttendanceStyle.AttendanceBackButton,
            { padding: moderateScale(15) },
          ]}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              marginRight: moderateScale(10),
            }}
          />
          <Text
            style={[
              AttendanceStyle.AttendanceBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Attendances")}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          AttendanceStyle.AttendanceTitlesContainer,
          { height: moderateScale(40) },
        ]}
      >
        <View style={AttendanceStyle.AttendanceDateTitleContainer}>
          <Text
            style={[
              AttendanceStyle.AttendanceTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Date")}
          </Text>
        </View>
        <View style={AttendanceStyle.AttendanceTitleContainer}>
          <Text
            style={[
              AttendanceStyle.AttendanceTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Morning")}
          </Text>
        </View>
        <View style={AttendanceStyle.AttendanceTitleContainer}>
          <Text
            style={[
              AttendanceStyle.AttendanceTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Afternoon")}
          </Text>
        </View>
        <View style={AttendanceStyle.AttendanceFineTitleContainer}>
          <Text
            style={[
              AttendanceStyle.AttendanceTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Fine")}
          </Text>
        </View>
      </View>
      {load ? (
        <View style={HomeStyle.HomeContentContainer}>
          <Image
            source={require("../assets/Images/loader-1.gif")}
            style={{
              width: moderateScale(100),
              height: moderateScale(100),
            }}
          />
        </View>
      ) : AttendanceData?.getAttendanceMobile?.length === 0 ? (
        <View style={HomeStyle.HomeContentContainer}>
          <Text
            style={[
              AttendanceStyle.AttendanceTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Empty")}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {AttendanceData?.getAttendanceMobile.map(
            (attendance: any, index: number) => (
              <Animatable.View
                style={[
                  AttendanceStyle.AttendanceBodyContainer,
                  { height: moderateScale(55) },
                ]}
                key={index}
                animation={load ? "fadeInUp" : "fadeInUp"}
              >
                <View style={AttendanceStyle.AttendanceDateTitleContainer}>
                  <Text
                    style={[
                      AttendanceStyle.AttendanceBodyText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {moment(attendance?.date).format("DD MMM YY")}
                  </Text>
                </View>
                <View style={AttendanceStyle.AttendanceTitleContainer}>
                  <Text
                    style={[
                      AttendanceStyle.AttendanceBodyText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.morning}
                  </Text>
                </View>
                <View style={AttendanceStyle.AttendanceTitleContainer}>
                  <Text
                    style={[
                      AttendanceStyle.AttendanceBodyText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.afternoon}
                  </Text>
                </View>
                <View style={AttendanceStyle.AttendanceFineTitleContainer}>
                  {attendance?.fine > 0 ? (
                    <Text
                      style={[
                        AttendanceStyle.AttendanceBodyFineText,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      ${attendance?.fine}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        AttendanceStyle.AttendanceBodyNoFineText,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      ${attendance?.fine}
                    </Text>
                  )}
                </View>
              </Animatable.View>
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
                height: moderateScale(50),
              }}
            >
              <Text
                style={{
                  fontFamily: "Kantumruy-Bold",
                  color: "#4cbb17",
                  fontSize: moderateScale(16),
                }}
              >
                {t("seemore")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
