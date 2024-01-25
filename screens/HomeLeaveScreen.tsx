import {
  Alert,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import HomeStyle from "../styles/HomeStyle.scss";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import { AuthContext } from "../Context/AuthContext";
import { useMutation, useQuery } from "@apollo/client";
import { REQUEST_LEAVE } from "../graphql/RequestLeave";
import { GETTIMEOFFSFORMOBILE } from "../graphql/GetTimeOffsForMobile";
import { moderateScale } from "../ Metrics";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { GETWKORINGTIMEBYEMPFORMOBILE } from "../graphql/GetWorkingTimeByEmpForMobile";
import { GETBREAKTIMEBYEMPWORKINGTIMEFORMOBILE } from "../graphql/GetBreakTimeByEmpWorkingTimeForMobile";

export default function HomeLeaveScreen({ versionData }: any) {
  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allDay, setAllDay] = useState(true);
  const [halfDay, setHalfDay] = useState(false);
  const [dateIsvisble, setDateIsvisible] = useState(false);
  const [dateIsvisble2, setDateIsvisible2] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeOff, setTimeOff] = useState([]);
  const [timeId, setTimeId] = useState("");
  const [reason, setReason] = useState("");
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [defaultTimeoff, setDefaultTimeoff] = useState("");
  const [workingTimeId, setWorkingTimeId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  // console.log(startDate);
  const hidDatePicker = () => {
    setDateIsvisible(false);
  };

  const hidDatePicker2 = () => {
    setDateIsvisible2(false);
  };

  const showDatePicker = () => {
    setDateIsvisible(true);
  };

  const showDatePicker2 = () => {
    setDateIsvisible2(true);
  };

  const handConfirm = (selectedDate: Date) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      hidDatePicker();
    }
  };

  const handConfirm2 = (selectedDate2: Date) => {
    if (selectedDate2) {
      setEndDate(selectedDate2);
      hidDatePicker2();
    }
  };

  const { data: TimeDate, refetch: TimeRefetch } = useQuery(
    GETTIMEOFFSFORMOBILE,
    {
      // pollInterval: 2000,
      onCompleted(data) {
        // console.log(data);
        setTimeOff(TimeDate?.getTimeOffsForMobile);
      },
      onError(error) {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    TimeRefetch();
  }, []);

  const { data: WorkingTime, refetch: WorkingRefetch } = useQuery(
    GETWKORINGTIMEBYEMPFORMOBILE,
    {
      onCompleted(data) {
        console.log(WorkingTime);
        setTimeOff(data?.getWorkingTimeByEmpForMobile);
      },
      onError(error) {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    WorkingRefetch();
  }, []);

  const { data: breakData, refetch: breakRefetch } = useQuery(
    GETBREAKTIMEBYEMPWORKINGTIMEFORMOBILE,
    {
      // pollInterval: 2000,
      variables: {
        workingTimeId: workingTimeId,
      },
      onCompleted: ({ getBreakTimeByEmpWorkingTimeForMobile }) => {
        console.log(getBreakTimeByEmpWorkingTimeForMobile);
      },
      onError: (err) => {
        console.log(err?.message);
      },
    }
  );

  useEffect(() => {
    breakRefetch();
  }, [workingTimeId]);

  useEffect(() => {
    setDefaultTimeoff(
      TimeDate?.getTimeOffsForMobile
        ? TimeDate?.getTimeOffsForMobile[0]?.timeOff
        : ""
    );
    setTimeId(
      TimeDate?.getTimeOffsForMobile
        ? TimeDate?.getTimeOffsForMobile[0]?._id
        : ""
    );
  }, [TimeDate]);

  const [requestLeave] = useMutation(REQUEST_LEAVE);

  const handlRequest = async () => {
    const newValues = {
      from: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      reason: reason ? reason : "",
      shiftOff: allDay ? "AllDay" : "HalfDay",
      timeOff: timeId ? timeId : "",
      to:
        allDay === true && endDate
          ? moment(endDate).format("YYYY-MM-DD")
          : startDate
          ? moment(startDate).format("YYYY-MM-DD")
          : "",
      workingTimeId: workingTimeId,
      breakStart: start,
      breakEnd: end,
    };
    // console.log(newValues);

    await requestLeave({
      variables: { input: newValues },
      onCompleted: ({ requestLeave }) => {
        console.log(requestLeave);
        Alert.alert(
          requestLeave?.status ? "Success!" : "Opp!",
          requestLeave?.message,
          [
            {
              text: "Okay",
              onPress: () => {
                if (requestLeave?.status === true) {
                  navigate("/leave");
                }
              },
              style: "cancel",
            },
          ]
        );
      },
      onError(error) {
        Alert.alert("Opp!", error?.message);
      },
    });
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  if (!versionData) {
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
          <TouchableOpacity
            style={[
              HomeStyle.HomeFeaturesTitleButton,
              { padding: moderateScale(15) },
            ]}
            onPress={() => navigate("/home/main")}
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
                LeaveStyle.LeaveBackButtonTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              Main leave
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Kantumruy-Regular",
              fontSize: moderateScale(12),
              textAlign: "center",
            }}
          >
            Please update your app to access this feature.{"\n"}
            សូម update កម្មវិធីទូរសព្ទ័ដើម្បីអាចប្រើមុខងារនេះបាន។
          </Text>
        </View>
      </View>
    );
  } else {
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
          <TouchableOpacity
            style={[
              HomeStyle.HomeFeaturesTitleButton,
              { padding: moderateScale(15) },
            ]}
            onPress={() => navigate("/home/main")}
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
                LeaveStyle.LeaveBackButtonTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              Main leave
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            backgroundColor: "#f8f8f8",
            padding: moderateScale(10),
            borderRadius: moderateScale(10),
          }}
          style={[
            HomeStyle.HomeMainScrollviewStyle,
            { padding: moderateScale(10) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* <KeyboardDismissableArea /> */}
          {!isKeyboardVisible ? (
            <>
              <View
                style={[
                  HomeStyle.HomeMainSelectDateButtonLabelContainer,
                  { height: moderateScale(40) },
                ]}
              >
                <Text
                  style={[
                    HomeStyle.HomeMainSelectDateButtonLabel,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Select Shift
                </Text>
              </View>
              <View
                style={[
                  HomeStyle.HomeMainSelectTimeContainer,
                  { height: moderateScale(40), paddingTop: moderateScale(10) },
                ]}
              >
                <TouchableOpacity
                  style={[
                    HomeStyle.HomeMainSelectTimeHalfContainer,
                    { marginRight: 10 },
                  ]}
                  onPress={() => {
                    setAllDay(true), setHalfDay(false);
                  }}
                >
                  <Image
                    source={
                      allDay
                        ? require("../assets/Images/rec.png")
                        : require("../assets/Images/reced.png")
                    }
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    All Day
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={HomeStyle.HomeMainSelectTimeHalfContainer}
                  onPress={() => {
                    setAllDay(false), setHalfDay(true);
                  }}
                >
                  <Image
                    source={
                      halfDay
                        ? require("../assets/Images/rec.png")
                        : require("../assets/Images/reced.png")
                    }
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    Half Day
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={HomeStyle.HomeMainSelectDateContainer}>
                <View
                  style={[
                    HomeStyle.HomeMainSelectDateMiniContainer,
                    { marginRight: moderateScale(10) },
                  ]}
                >
                  <View
                    style={[
                      HomeStyle.HomeMainSelectDateButtonLabelContainer,
                      { height: moderateScale(40) },
                    ]}
                  >
                    <Text
                      style={[
                        HomeStyle.HomeMainSelectDateButtonLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {allDay ? "Start Date" : "Date"}
                    </Text>
                  </View>

                  <View
                    style={[
                      HomeStyle.HomeMainSelectDateButton,
                      {
                        height: moderateScale(40),
                        paddingHorizontal: moderateScale(10),
                        borderRadius: moderateScale(10),
                      },
                    ]}
                  >
                    <Image
                      source={require("../assets/Images/calendar.png")}
                      style={{
                        width: moderateScale(20),
                        height: moderateScale(20),
                        marginRight: moderateScale(10),
                      }}
                    />
                    <View style={HomeStyle.HomeMainSelectDateSection}>
                      <TouchableOpacity onPress={showDatePicker}>
                        <Text
                          style={[
                            HomeStyle.HomeMainSelectDateButtonPlaceholder,
                            { fontSize: moderateScale(12) },
                          ]}
                        >
                          {moment(startDate).format("DD-MM-YYYY")}
                        </Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={dateIsvisble}
                        mode="date"
                        onConfirm={handConfirm}
                        onCancel={hidDatePicker}
                      />
                    </View>
                  </View>
                </View>
                {!halfDay && (
                  <View style={HomeStyle.HomeMainSelectDateMiniContainer}>
                    <View
                      style={[
                        HomeStyle.HomeMainSelectDateButtonLabelContainer,
                        { height: moderateScale(40) },
                      ]}
                    >
                      <Text
                        style={[
                          HomeStyle.HomeMainSelectDateButtonLabel,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        End Date
                      </Text>
                    </View>

                    <View
                      style={[
                        HomeStyle.HomeMainSelectDateButton,
                        {
                          height: moderateScale(40),
                          paddingHorizontal: moderateScale(10),
                          borderRadius: moderateScale(10),
                        },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/calendar.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <TouchableOpacity onPress={showDatePicker2}>
                        <Text
                          style={[
                            HomeStyle.HomeMainSelectDateButtonPlaceholder,
                            { fontSize: moderateScale(12) },
                          ]}
                        >
                          {moment(endDate).format("DD-MM-YYYY")}
                        </Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={dateIsvisble2}
                        mode="date"
                        onConfirm={handConfirm2}
                        onCancel={hidDatePicker2}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={HomeStyle.HomeMainSelectDateContainer}>
                <View style={{ width: "100%" }}>
                  <View
                    style={[
                      HomeStyle.HomeMainSelectDateButtonLabelContainer,
                      { height: moderateScale(40) },
                    ]}
                  >
                    <Text
                      style={[
                        HomeStyle.HomeMainSelectDateButtonLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      Request For
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    style={{ width: "100%" }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {WorkingTime?.getWorkingTimeByEmpForMobile
                      ? WorkingTime?.getWorkingTimeByEmpForMobile.map(
                          (data: any, index: number) => (
                            <View
                              style={HomeStyle.HomeMainSelectDateSection}
                              key={index}
                            >
                              <TouchableOpacity
                                style={[
                                  HomeStyle.HomeMainSelectDateButton,
                                  {
                                    height: moderateScale(40),
                                    paddingHorizontal: moderateScale(10),
                                    borderRadius: moderateScale(10),
                                    marginRight: moderateScale(10),
                                    marginBottom:
                                      dimension === "sm" ||
                                      Platform.OS === "android"
                                        ? moderateScale(10)
                                        : 0,
                                  },
                                ]}
                                onPress={() => {
                                  setWorkingTimeId(
                                    data?._id !== workingTimeId ? data?._id : ""
                                  );
                                }}
                              >
                                <Image
                                  source={
                                    workingTimeId === data?._id
                                      ? require("../assets/Images/rec.png")
                                      : require("../assets/Images/reced.png")
                                  }
                                  style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    marginRight: moderateScale(10),
                                  }}
                                />
                                <Text
                                  style={[
                                    HomeStyle.HomeMainSelectDateButtonPlaceholder,
                                    { fontSize: moderateScale(12) },
                                  ]}
                                >
                                  {data?.shiftName} Shift
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                        )
                      : null}
                  </ScrollView>
                </View>
              </View>
              {workingTimeId.length === 0 && (
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      color: "#ff0000",
                      padding: moderateScale(5),
                      fontSize: moderateScale(14),
                    }}
                  >
                    Require!
                  </Text>
                </View>
              )}
              {allDay ? null : (
                <>
                  <View style={HomeStyle.HomeMainSelectDateContainer}>
                    <View style={{ width: "100%" }}>
                      <View
                        style={[
                          HomeStyle.HomeMainSelectDateButtonLabelContainer,
                          { height: moderateScale(40) },
                        ]}
                      >
                        <Text
                          style={[
                            HomeStyle.HomeMainSelectDateButtonLabel,
                            { fontSize: moderateScale(14) },
                          ]}
                        >
                          Time
                        </Text>
                      </View>
                      <ScrollView
                        horizontal
                        style={{ width: "100%" }}
                        showsHorizontalScrollIndicator={false}
                      >
                        {breakData?.getBreakTimeByEmpWorkingTimeForMobile !==
                        null ? (
                          <View style={HomeStyle.HomeMainSelectDateSection}>
                            <TouchableOpacity
                              style={[
                                HomeStyle.HomeMainSelectDateButton,
                                {
                                  height: moderateScale(40),
                                  paddingHorizontal: moderateScale(10),
                                  borderRadius: moderateScale(10),
                                  marginRight: moderateScale(10),
                                  marginBottom:
                                    dimension === "sm" ||
                                    Platform.OS === "android"
                                      ? moderateScale(10)
                                      : 0,
                                },
                              ]}
                              onPress={() => {
                                setStart(
                                  breakData
                                    ?.getBreakTimeByEmpWorkingTimeForMobile
                                    ?.firstStart !== start
                                    ? breakData
                                        ?.getBreakTimeByEmpWorkingTimeForMobile
                                        ?.firstStart
                                    : ""
                                );
                                setEnd(
                                  breakData
                                    ?.getBreakTimeByEmpWorkingTimeForMobile
                                    ?.firstEnd !== end
                                    ? breakData
                                        ?.getBreakTimeByEmpWorkingTimeForMobile
                                        ?.firstEnd
                                    : ""
                                );
                              }}
                            >
                              <Image
                                source={
                                  start ===
                                    breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.firstStart &&
                                  end ===
                                    breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.firstEnd
                                    ? require("../assets/Images/rec.png")
                                    : require("../assets/Images/reced.png")
                                }
                                style={{
                                  width: moderateScale(20),
                                  height: moderateScale(20),
                                  marginRight: moderateScale(10),
                                }}
                              />
                              <Text
                                style={[
                                  HomeStyle.HomeMainSelectDateButtonPlaceholder,
                                  { fontSize: moderateScale(12) },
                                ]}
                              >
                                {breakData
                                  ?.getBreakTimeByEmpWorkingTimeForMobile
                                  ?.firstStart !== null
                                  ? breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.firstStart
                                  : "--"}
                                ~
                                {breakData
                                  ?.getBreakTimeByEmpWorkingTimeForMobile
                                  ?.firstEnd !== null
                                  ? breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.firstEnd
                                  : "--"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}

                        {breakData?.getBreakTimeByEmpWorkingTimeForMobile !==
                        null ? (
                          <View style={HomeStyle.HomeMainSelectDateSection}>
                            <TouchableOpacity
                              style={[
                                HomeStyle.HomeMainSelectDateButton,
                                {
                                  height: moderateScale(40),
                                  paddingHorizontal: moderateScale(10),
                                  borderRadius: moderateScale(10),
                                  marginRight: moderateScale(10),
                                  marginBottom:
                                    dimension === "sm" ||
                                    Platform.OS === "android"
                                      ? moderateScale(10)
                                      : 0,
                                },
                              ]}
                              onPress={() => {
                                setStart(
                                  breakData
                                    ?.getBreakTimeByEmpWorkingTimeForMobile
                                    ?.secondStart !== start
                                    ? breakData
                                        ?.getBreakTimeByEmpWorkingTimeForMobile
                                        ?.secondStart
                                    : ""
                                );
                                setEnd(
                                  breakData
                                    ?.getBreakTimeByEmpWorkingTimeForMobile
                                    ?.secondEnd !== end
                                    ? breakData
                                        ?.getBreakTimeByEmpWorkingTimeForMobile
                                        ?.secondEnd
                                    : ""
                                );
                              }}
                            >
                              <Image
                                source={
                                  start ===
                                    breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.secondStart &&
                                  end ===
                                    breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.secondEnd
                                    ? require("../assets/Images/rec.png")
                                    : require("../assets/Images/reced.png")
                                }
                                style={{
                                  width: moderateScale(20),
                                  height: moderateScale(20),
                                  marginRight: moderateScale(10),
                                }}
                              />
                              <Text
                                style={[
                                  HomeStyle.HomeMainSelectDateButtonPlaceholder,
                                  { fontSize: moderateScale(12) },
                                ]}
                              >
                                {breakData
                                  ?.getBreakTimeByEmpWorkingTimeForMobile
                                  ?.secondStart !== null
                                  ? breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.secondStart
                                  : "--"}
                                ~
                                {breakData
                                  ?.getBreakTimeByEmpWorkingTimeForMobile
                                  ?.secondEnd !== null
                                  ? breakData
                                      ?.getBreakTimeByEmpWorkingTimeForMobile
                                      ?.secondEnd
                                  : "--"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </ScrollView>
                    </View>
                  </View>
                  {start === "" && end === "" && (
                    <View style={{ width: "100%" }}>
                      <Text
                        style={{
                          color: "#ff0000",
                          padding: moderateScale(5),
                          fontSize: moderateScale(14),
                        }}
                      >
                        Require!
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          ) : null}
          <View
            style={[
              HomeStyle.HomeMainSelectDateButtonLabelContainer,
              { height: moderateScale(40) },
            ]}
          >
            <Text
              style={[
                HomeStyle.HomeMainSelectDateButtonLabel,
                { fontSize: moderateScale(14) },
              ]}
            >
              Type Time Off
            </Text>
          </View>
          {timeOff && timeOff.length === 0 ? (
            <View style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  height: dimension === "sm" ? 30 : 40,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#9aa3a6",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Text style={{ color: "#9aa3a6" }}>Choose time off</Text>
              </View>
              <Text style={{ color: "#ff0000", padding: 5 }}>
                You don't have time-off, please contact HR!
              </Text>
            </View>
          ) : (
            <SelectDropdown
              data={TimeDate?.getTimeOffsForMobile}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem, index);
                setTimeId(selectedItem?._id);
              }}
              renderCustomizedButtonChild={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return (
                  <View>
                    <Text
                      style={[
                        HomeStyle.HomeMainSelectDateButtonPlaceholder,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      {selectedItem?.timeOff
                        ? selectedItem?.timeOff
                        : defaultTimeoff
                        ? defaultTimeoff
                        : "Choose time off"}
                    </Text>
                  </View>
                );
              }}
              dropdownStyle={{
                borderRadius: moderateScale(10),
                paddingHorizontal: moderateScale(10),
              }}
              renderCustomizedRowChild={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return (
                  <View>
                    <Text
                      style={[
                        HomeStyle.HomeMainSelectDateButtonPlaceholder,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      {item?.timeOff}
                    </Text>
                  </View>
                );
              }}
              buttonStyle={{
                width: "100%",
                height: moderateScale(40),
                backgroundColor: "#f8f8f8",
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
                borderColor: "#177a02",
              }}
            />
          )}

          <View
            style={[
              HomeStyle.HomeMainSelectDateButtonLabelContainer,
              { height: moderateScale(40) },
            ]}
          >
            <Text
              style={[
                HomeStyle.HomeMainSelectDateButtonLabel,
                { fontSize: moderateScale(14) },
              ]}
            >
              Reason
            </Text>
          </View>
          <View
            style={[
              HomeStyle.HomeLeaveReasonContainer,
              {
                height: moderateScale(40),
                borderWidth: moderateScale(1),
                borderRadius: moderateScale(10),
                paddingLeft: moderateScale(10),
              },
            ]}
          >
            <TextInput
              value={reason}
              placeholder="Reason"
              style={[
                HomeStyle.HomeLeaveReasonStyle,
                { fontSize: moderateScale(12) },
              ]}
              onChangeText={(e) => setReason(e)}
              maxLength={50} // Set the maximum number of characters
              returnKeyType="done"
            />
          </View>
          {reason.length === 0 && (
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  color: "#ff0000",
                  padding: moderateScale(5),
                  fontSize: moderateScale(14),
                }}
              >
                Require!
              </Text>
            </View>
          )}
          <View
            style={[
              HomeStyle.HomeMainSelectDateButtonLabelContainer,
              { height: moderateScale(40) },
            ]}
          >
            <Text
              style={[
                HomeStyle.HomeMainSelectDateButtonLabel,
                { fontSize: moderateScale(14) },
              ]}
            >
              {" "}
            </Text>
          </View>
          {isKeyboardVisible ? null : (
            <TouchableOpacity
              style={[
                HomeStyle.HomeLeaveRequestButton,
                {
                  height: moderateScale(40),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(10),
                  borderRadius: moderateScale(10),
                  backgroundColor:
                    reason !== "" && timeId !== "" && workingTimeId !== ""
                      ? "#177a02"
                      : "#dcdcdc",
                },
              ]}
              activeOpacity={
                reason !== "" && timeId !== "" && workingTimeId !== "" ? 0.4 : 1
              }
              onPress={() => {
                if (reason !== "" && timeId !== "" && workingTimeId !== "") {
                  handlRequest();
                }
              }}
            >
              <Text
                style={[
                  HomeStyle.HomeLeaveRequestButtonText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Request
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}
