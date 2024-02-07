import { ActivityIndicator, Image, Keyboard, Text, View } from "react-native";
import HomeStyle from "../styles/HomeStyle.scss";
import moment, { months } from "moment";
import { Outlet } from "react-router-native";
import { useEffect, useState } from "react";
import KeyboardDismissableArea from "../functions/KeyboardDismissableArea";
import { useQuery } from "@apollo/client";
import { GETEMPLOYEELEAVEINFO } from "../graphql/GetEmployeeLeaveInfo";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";
import { useTranslation } from "react-multi-lang";
import SelectDropdown from "react-native-select-dropdown";

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
    title: "Early",
  },
  {
    title: "Fine",
  },
];

const Months = [
  {
    month: "January",
    number: 1,
  },
  {
    month: "February",
    number: 2,
  },
  {
    month: "March",
    number: 3,
  },
  {
    month: "April",
    number: 4,
  },
  {
    month: "May",
    number: 5,
  },
  {
    month: "June",
    number: 6,
  },
  {
    month: "July",
    number: 7,
  },
  {
    month: "August",
    number: 8,
  },
  {
    month: "September",
    number: 9,
  },
  {
    month: "October",
    number: 10,
  },
  {
    month: "November",
    number: 11,
  },
  {
    month: "December",
    number: 12,
  },
];

export default function HomeScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { uid } = useContext(AuthContext);
  const { dimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const t = useTranslation();
  const [year, setYear] = useState(new Date());
  const [month, setMonth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 100);
  }, []);

  const [dateArray, setDateArray] = useState<Date[]>([]);

  useEffect(() => {
    // Function to generate the array of dates
    const generateDateArray = () => {
      // Get the current date
      let currentDate = new Date();

      // Initialize an array to store the dates
      let newArray = [] as Date[];

      // Add current date to the array
      newArray.push(new Date(currentDate));

      // Add dates 10 years ahead
      for (let i = 1; i <= 5; i++) {
        let nextYearDate = new Date(currentDate);
        nextYearDate.setFullYear(currentDate.getFullYear() + i * 1);
        newArray.push(nextYearDate);
      }

      // Subtract dates 10 years back
      for (let i = 1; i <= 5; i++) {
        let pastYearDate = new Date(currentDate);
        pastYearDate.setFullYear(currentDate.getFullYear() - i * 1);
        newArray.push(pastYearDate);
      }

      // Sort the array of dates in ascending order
      newArray.sort((a, b) => b.getTime() - a.getTime());

      // Update the state with the new array
      setDateArray(newArray);
    };

    // Call the function to generate the array when the component mounts
    generateDateArray();
  }, []); // The empty dependency array ensures that this effect runs only once, equivalent to componentDidMount
  const { data: leaveData, refetch: leavRefetch } = useQuery(
    GETEMPLOYEELEAVEINFO,
    {
      // pollInterval: 2000,
      variables: {
        employeeId: uid ? uid : "",
        month:
          month !== 0 ? month : parseInt(moment(new Date()).format("M"), 10),
        year: parseInt(moment(year).format("YYYY"), 10),
      },
      onCompleted: ({ getEmployeeLeaveInfo }) => {
        // console.log("getEmployeeLeaveInfo", getEmployeeLeaveInfo);
      },
      onError(error) {
        console.log(error?.message);
      },
      fetchPolicy: "cache-and-network",
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

  useEffect(() => {
    // console.log(month + "-" + moment(year).format("YYYY"));
    // console.log(moment(new Date()).format("M"));
  }, [month, year]);
  return (
    <View style={HomeStyle.HomeContainer}>
      <KeyboardDismissableArea />
      {!isKeyboardVisible ? (
        <>
          <View style={HomeStyle.HomeSelectDateContainer}>
            <View
              style={{
                width: moderateScale(140),
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <SelectDropdown
                data={Months}
                onSelect={(selectedItem, index) => {
                  setMonth(selectedItem?.number);
                }}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return (
                    <Text
                      style={[
                        HomeStyle.HomeSelectDateText,
                        {
                          fontSize: moderateScale(14),
                          textAlign: "left",
                          fontFamily: "Kantumruy-Bold",
                          color: "#fff",
                          textTransform: "capitalize",
                        },
                      ]}
                    >
                      {selectedItem
                        ? t(selectedItem?.month)
                        : t(moment(new Date()).format("MMMM"))}
                    </Text>
                  );
                }}
                dropdownStyle={{
                  borderRadius: moderateScale(10),
                  justifyContent: "center",
                  alignContent: "center",
                }}
                renderCustomizedRowChild={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return (
                    <Text
                      style={[
                        {
                          fontSize: moderateScale(12),
                          textAlign: "center",
                          fontFamily: "Kantumruy-Regular",
                        },
                      ]}
                    >
                      {t(item?.month)}
                    </Text>
                  );
                }}
                buttonStyle={{
                  width: moderateScale(90),
                  height: moderateScale(30),
                  backgroundColor: "#177a02",
                  // borderWidth: moderateScale(1),
                  justifyContent: "flex-end",
                  alignContent: "center",
                }}
              />
              <SelectDropdown
                data={dateArray}
                onSelect={(selectedItem, index) => {
                  // console.log(selectedItem, index);
                  setYear(selectedItem);
                }}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return (
                    <Text
                      style={[
                        HomeStyle.HomeSelectDateText,
                        {
                          fontSize: moderateScale(14),
                          textAlign: "left",
                          fontFamily: "Kantumruy-Bold",
                          color: "#fff",
                        },
                      ]}
                    >
                      {selectedItem
                        ? t(moment(selectedItem).format("YYYY"))
                        : t(moment(year).format("YYYY"))}
                    </Text>
                  );
                }}
                dropdownStyle={{
                  borderRadius: moderateScale(10),
                  // paddingHorizontal: moderateScale(10),
                  justifyContent: "center",
                  alignContent: "flex-start",
                }}
                renderCustomizedRowChild={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return (
                    <Text
                      style={[
                        {
                          fontSize: moderateScale(12),
                          textAlign: "center",
                          fontFamily: "Kantumruy-Regular",
                        },
                      ]}
                    >
                      {t(moment(item).format("YYYY"))}
                    </Text>
                  );
                }}
                buttonStyle={{
                  width: moderateScale(60),
                  height: moderateScale(30),
                  backgroundColor: "#177a02",
                  // borderRadius: moderateScale(10),
                  // borderWidth: moderateScale(1),
                  // borderColor: "#fff",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              />
            </View>

            <View style={{ paddingRight: moderateScale(10) }}></View>
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
                    {action.title === "Early"
                      ? leaveData?.getEmployeeLeaveInfo?.outEarly
                        ? leaveData?.getEmployeeLeaveInfo?.outEarly
                        : "0"
                      : action.title === "Day Off"
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
                  {t(action.title)}
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
