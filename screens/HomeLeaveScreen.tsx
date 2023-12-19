import {
  Alert,
  Image,
  Keyboard,
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
import KeyboardDismissableArea from "../functions/KeyboardDismissableArea";

export default function HomeLeaveScreen() {
  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allDay, setAllDay] = useState(true);
  const [halfDay, setHalfDay] = useState(false);
  const [dateIsvisble, setDateIsvisible] = useState(false);
  const [dateIsvisble2, setDateIsvisible2] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const countries = ["Egypt", "Canada", "Australia", "Ireland"];
  const [timeOff, setTimeOff] = useState([]);
  const [timeId, setTimeId] = useState("");
  const [reason, setReason] = useState("");
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);

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
      pollInterval: 2000,
      onCompleted(data) {
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

  const [requestLeave] = useMutation(REQUEST_LEAVE);

  const handlRequest = async () => {
    const newValues = {
      from: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      reason: reason ? reason : "",
      shiftOff: allDay
        ? "AllDay"
        : morning
        ? "Morning"
        : afternoon
        ? "Afternoon"
        : "",
      timeOff: timeId ? timeId : "",
      to:
        allDay === true && endDate
          ? moment(endDate).format("YYYY-MM-DD")
          : startDate
          ? moment(startDate).format("YYYY-MM-DD")
          : "",
    };
    console.log(newValues);
    await requestLeave({
      variables: { input: newValues },
      onCompleted: ({ requestLeave }) => {
        Alert.alert("Success!", requestLeave?.message, [
          {
            text: "Okay",
            onPress: () => navigate("/home/main"),
            style: "cancel",
          },
        ]);
      },
      onError(error) {
        Alert.alert("Success!", error?.message);
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

  return (
    <View style={HomeStyle.HomeMainContentContainer}>
      <View
        style={
          dimension === "sm"
            ? HomeStyle.HomeFeaturesTitleSM
            : HomeStyle.HomeFeaturesTitle
        }
      >
        <TouchableOpacity
          style={HomeStyle.HomeFeaturesTitleButton}
          onPress={() => navigate("/home/main")}
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={
              dimension === "sm"
                ? HomeStyle.HomeMainBackIconSM
                : HomeStyle.HomeMainBackIcon
            }
          />
          <Text
            style={
              dimension === "sm"
                ? HomeStyle.HomeFeaturesTitleTextSM
                : HomeStyle.HomeFeaturesTitleText
            }
          >
            Main leave
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          backgroundColor: "#f8f8f8",
          padding: dimension === "sm" ? 5 : 10,
          borderRadius: 10,
        }}
        style={HomeStyle.HomeMainScrollviewStyle}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardDismissableArea />
        {!isKeyboardVisible ? (
          <>
            <View style={HomeStyle.HomeMainSelectDateButtonLabelContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? HomeStyle.HomeMainSelectDateButtonLabelSM
                    : HomeStyle.HomeMainSelectDateButtonLabel
                }
              >
                Select Shift
              </Text>
            </View>
            <View
              style={
                dimension === "sm"
                  ? HomeStyle.HomeMainSelectTimeContainerSM
                  : HomeStyle.HomeMainSelectTimeContainer
              }
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
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectIconSM
                      : HomeStyle.HomeMainSelectIcon
                  }
                />
                <Text
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectTitleSM
                      : HomeStyle.HomeMainSelectTitle
                  }
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
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectIconSM
                      : HomeStyle.HomeMainSelectIcon
                  }
                />
                <Text
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectTitleSM
                      : HomeStyle.HomeMainSelectTitle
                  }
                >
                  Half Day
                </Text>
              </TouchableOpacity>
            </View>
            <View style={HomeStyle.HomeMainSelectDateContainer}>
              <View
                style={[
                  HomeStyle.HomeMainSelectDateMiniContainer,
                  { marginRight: 10 },
                ]}
              >
                <View
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectDateButtonLabelContainerSM
                      : HomeStyle.HomeMainSelectDateButtonLabelContainer
                  }
                >
                  <Text
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeMainSelectDateButtonLabelSM
                        : HomeStyle.HomeMainSelectDateButtonLabel
                    }
                  >
                    {allDay ? "Start Date" : "Date"}
                  </Text>
                </View>

                <View
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectDateButtonSM
                      : HomeStyle.HomeMainSelectDateButton
                  }
                >
                  <Image
                    source={require("../assets/Images/calendar.png")}
                    style={[
                      dimension === "sm"
                        ? HomeStyle.HomeMainSelectIconSM
                        : HomeStyle.HomeMainSelectIcon,
                      { marginRight: 10 },
                    ]}
                  />
                  <View style={HomeStyle.HomeMainSelectDateSection}>
                    <TouchableOpacity onPress={showDatePicker}>
                      <Text
                        style={
                          dimension === "sm"
                            ? HomeStyle.HomeMainSelectDateButtonPlaceholderSM
                            : HomeStyle.HomeMainSelectDateButtonPlaceholder
                        }
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
              <View style={HomeStyle.HomeMainSelectDateMiniContainer}>
                <View
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectDateButtonLabelContainerSM
                      : HomeStyle.HomeMainSelectDateButtonLabelContainer
                  }
                >
                  <Text
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeMainSelectDateButtonLabelSM
                        : HomeStyle.HomeMainSelectDateButtonLabel
                    }
                  >
                    {halfDay ? "Request For" : "End Date"}
                  </Text>
                </View>

                {halfDay ? (
                  <View
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeMainSelectDateSectionSM
                        : HomeStyle.HomeMainSelectDateSection
                    }
                  >
                    <TouchableOpacity
                      style={[
                        dimension === "sm"
                          ? HomeStyle.HomeMainSelectDateButtonSM
                          : HomeStyle.HomeMainSelectDateButton,
                        {
                          marginRight: 10,
                          marginBottom: dimension === "sm" ? 10 : 0,
                        },
                      ]}
                      onPress={() => {
                        setMorning(true);
                        setAfternoon(false);
                      }}
                    >
                      <Image
                        source={
                          morning
                            ? require("../assets/Images/rec.png")
                            : require("../assets/Images/reced.png")
                        }
                        style={[
                          dimension === "sm"
                            ? HomeStyle.HomeMainSelectIconSM
                            : HomeStyle.HomeMainSelectIcon,
                          { marginRight: 10 },
                        ]}
                      />
                      <Text
                        style={
                          dimension === "sm"
                            ? HomeStyle.HomeMainSelectDateButtonPlaceholderSM
                            : HomeStyle.HomeMainSelectDateButtonPlaceholder
                        }
                      >
                        Morning
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        dimension === "sm"
                          ? HomeStyle.HomeMainSelectDateButtonSM
                          : HomeStyle.HomeMainSelectDateButton
                      }
                      onPress={() => {
                        setMorning(false);
                        setAfternoon(true);
                      }}
                    >
                      <Image
                        source={
                          afternoon
                            ? require("../assets/Images/rec.png")
                            : require("../assets/Images/reced.png")
                        }
                        style={[
                          dimension === "sm"
                            ? HomeStyle.HomeMainSelectIconSM
                            : HomeStyle.HomeMainSelectIcon,
                          { marginRight: 10 },
                        ]}
                      />
                      <Text
                        style={
                          dimension === "sm"
                            ? HomeStyle.HomeMainSelectDateButtonPlaceholderSM
                            : HomeStyle.HomeMainSelectDateButtonPlaceholder
                        }
                      >
                        Afternoon
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={
                      dimension === "sm"
                        ? HomeStyle.HomeMainSelectDateButtonSM
                        : HomeStyle.HomeMainSelectDateButton
                    }
                  >
                    <Image
                      source={require("../assets/Images/calendar.png")}
                      style={[
                        dimension === "sm"
                          ? HomeStyle.HomeMainSelectIconSM
                          : HomeStyle.HomeMainSelectIcon,
                        { marginRight: 10 },
                      ]}
                    />
                    <TouchableOpacity onPress={showDatePicker2}>
                      <Text
                        style={
                          dimension === "sm"
                            ? HomeStyle.HomeMainSelectDateButtonPlaceholderSM
                            : HomeStyle.HomeMainSelectDateButtonPlaceholder
                        }
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
                )}
              </View>
            </View>
          </>
        ) : null}
        <View
          style={
            dimension === "sm"
              ? HomeStyle.HomeMainSelectDateButtonLabelContainerSM
              : HomeStyle.HomeMainSelectDateButtonLabelContainer
          }
        >
          <Text
            style={
              dimension === "sm"
                ? HomeStyle.HomeMainSelectDateButtonLabelSM
                : HomeStyle.HomeMainSelectDateButtonLabel
            }
          >
            Type Time Off
          </Text>
        </View>
        <SelectDropdown
          data={timeOff}
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
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectDateButtonPlaceholderSM
                      : HomeStyle.HomeMainSelectDateButtonPlaceholder
                  }
                >
                  {selectedItem?.timeOff
                    ? selectedItem?.timeOff
                    : "Choose time off"}
                </Text>
              </View>
            );
          }}
          dropdownStyle={{
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
          renderCustomizedRowChild={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return (
              <View>
                <Text
                  style={
                    dimension === "sm"
                      ? HomeStyle.HomeMainSelectDateButtonPlaceholderSM
                      : HomeStyle.HomeMainSelectDateButtonPlaceholder
                  }
                >
                  {item?.timeOff}
                </Text>
              </View>
            );
          }}
          buttonStyle={{
            width: "100%",
            height: dimension === "sm" ? 30 : 40,
            backgroundColor: "#f8f8f8",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#082b9e",
          }}
        />

        <View
          style={
            dimension === "sm"
              ? HomeStyle.HomeMainSelectDateButtonLabelContainerSM
              : HomeStyle.HomeMainSelectDateButtonLabelContainer
          }
        >
          <Text
            style={
              dimension === "sm"
                ? HomeStyle.HomeMainSelectDateButtonLabelSM
                : HomeStyle.HomeMainSelectDateButtonLabel
            }
          >
            Reason
          </Text>
        </View>
        <View
          style={
            dimension === "sm"
              ? HomeStyle.HomeLeaveReasonContainerSM
              : HomeStyle.HomeLeaveReasonContainer
          }
        >
          <TextInput
            value={reason}
            placeholder="Reason"
            style={
              dimension === "sm"
                ? HomeStyle.HomeLeaveReasonStyleSM
                : HomeStyle.HomeLeaveReasonStyle
            }
            onChangeText={(e) => setReason(e)}
            maxLength={50} // Set the maximum number of characters
          />
        </View>
        <View
          style={
            dimension === "sm"
              ? HomeStyle.HomeMainSelectDateButtonLabelContainerSM
              : HomeStyle.HomeMainSelectDateButtonLabelContainer
          }
        >
          <Text style={HomeStyle.HomeMainSelectDateButtonLabel}> </Text>
        </View>
        <TouchableOpacity
          style={
            dimension === "sm"
              ? HomeStyle.HomeLeaveRequestButtonSM
              : HomeStyle.HomeLeaveRequestButton
          }
          onPress={() => {
            if (reason !== "" && timeId !== "") {
              handlRequest();
            } else {
              Alert.alert("Oop!", "Please field the reason or choose time off");
            }
          }}
        >
          <Text
            style={
              dimension === "sm"
                ? HomeStyle.HomeLeaveRequestButtonTextSM
                : HomeStyle.HomeLeaveRequestButtonText
            }
          >
            Request
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
