import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { useLocation, useNavigate } from "react-router-native";
import { useMutation, useQuery } from "@apollo/client";
import { EMPLOYEECHECKATTENDANCE } from "../graphql/EmployeeCheckAttendance";
import CheckStyle from "../styles/CheckStyle.scss";
import { useContext, useEffect, useState } from "react";
import HomeStyle from "../styles/HomeStyle.scss";
import ModalStyle from "../styles/ModalStyle.scss";
import * as Location from "expo-location";
import CheckModal from "../components/CheckModal";
import { AuthContext } from "../Context/AuthContext";
import { getDistance, getPreciseDistance, isPointWithinRadius } from "geolib";
import { GET_EMPLOYEEBYID } from "../graphql/GetEmployeeById";
import { moderateScale } from "../ Metrics";
import { GETCHECKINOUTBUTTON } from "../graphql/GetCheckInOutButton";

export default function ChecKAttendance({ locate }: any) {
  const { uid } = useContext(AuthContext);
  const navigate = useNavigate();
  const located = useLocation();
  const [isVisible, setVisible] = useState(false);
  const [CheckIsVisible, setCheckVisible] = useState(false);
  const [scanType, setScanType] = useState("");
  const { dimension } = useContext(AuthContext);
  const [checkData, setCheckData] = useState<{
    message: string;
    status: boolean | null;
  }>({
    message: "",
    status: null,
  });

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [load, setLoad] = useState(true);

  const { data: getCheckInOutButtonData, refetch: getCheckInOutButtonRefetch } =
    useQuery(GETCHECKINOUTBUTTON, {
      pollInterval: 2000,
      variables: {
        shift: morning ? "morning" : afternoon ? "afternoon" : "",
      },
      onCompleted: ({ getCheckInOutButton }) => {
        // console.log("getCheckInOutButton: ", getCheckInOutButton);
      },
    });

  useEffect(() => {
    getCheckInOutButtonRefetch();
  }, [afternoon, morning]);

  const { data: employeeData, refetch: employeeRefetch } = useQuery(
    GET_EMPLOYEEBYID,
    {
      pollInterval: 2000,
      variables: {
        id: uid ? uid : "",
      },
      onCompleted: ({ getEmployeeById }) => {},
    }
  );

  useEffect(() => {
    employeeRefetch();
  }, [uid]);

  const distance = getDistance(
    {
      latitude: locate?.coords.latitude ? locate?.coords.latitude : 0,
      longitude: locate?.coords.longitude ? locate?.coords.longitude : 0,
    },
    {
      latitude: parseFloat(
        employeeData?.getEmployeeById?.latitude
          ? employeeData?.getEmployeeById?.latitude
          : ""
      ),
      longitude: parseFloat(
        employeeData?.getEmployeeById?.longitude
          ? employeeData?.getEmployeeById?.longitude
          : ""
      ),
    }
    // { latitude: 13.3564631 , longitude: 103.8332306 }
  );

  // console.log(distance);

  const handleCheckClose = () => {
    setCheckVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setCheckData({
        message: "",
        status: null,
      });
    }, 500);
    setLocation(null);
    setLoad(true);
  };

  const handleCheckOpen = () => {
    setCheckVisible(true);
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleLocationPermission = async () => {
    try {
      // Request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Handle the permission status
      if (status === "granted") {
        console.log("Foreground location permission granted");
        // Perform actions that require foreground location permission here
      } else {
        console.log("Foreground location permission denied");
        // Handle denied permission (e.g., show a message to the user)
        Alert.alert(
          "Permission Denied",
          "Foreground location permission is required for this feature.",
          [
            {
              text: "Settings",
              onPress: () => Linking.openSettings(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting foreground location permission:", error);
      // Handle errors if any
    }
  };

  // console.log(locate);
  const [employeeCheckAttendance] = useMutation(EMPLOYEECHECKATTENDANCE);

  const CheckInOut = async (located: any) => {
    let createValue = {
      longitude: located?.coords.longitude
        ? located?.coords.longitude.toString()
        : location?.coords.longitude
        ? location?.coords.longitude.toString()
        : "",
      latitude: located?.coords.latitude
        ? located?.coords.latitude.toString()
        : location?.coords.latitude
        ? location?.coords.latitude.toString()
        : "",
      shift: morning ? "morning" : afternoon ? "afternoon" : "",
      scan: scanType,
    };
    // console.log(createValue);
    await employeeCheckAttendance({
      variables: {
        ...createValue,
      },
      onCompleted(data) {
        // console.log("Succeed", data);
        if (data?.employeeCheckAttendance?.status === false) {
          Vibration.vibrate();
        }
        setCheckData({
          message: data?.employeeCheckAttendance?.message,
          status: data?.employeeCheckAttendance?.status,
        });
        setLoad(false);
        if (checkData) {
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
      },
      onError(error: any) {
        // console.log("Fail", error?.message);
        setCheckData({
          message: error?.message,
          status: error?.status,
        });
        setLoad(false);
        setTimeout(() => {
          handleClose();
        }, 1500);
      },
    });
  };

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      // const $location = await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.Low,
      // });
      // // const $location = null;
      // // console.log($location);
      // setLocation($location);
      // if ($location) {
      //   handleOpen();
      //   setTimeout(() => {
      //     CheckInOut($location);
      //   }, 500);
      // } else if ($location === null) {
      //   handleOpen();
      //   setCheckData({
      //     message: "Cannot get your location!",
      //     status: null,
      //   });
      //   setLoad(false);
      //   setTimeout(() => {
      //     handleClose();
      //   }, 1500);
      // }

      const locationListener = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Low,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location);
          handleOpen();
          CheckInOut(location);
        }
      );

      // Optionally, you can store the location listener to stop it later
      // e.g., store it in a state variable or a ref
      // const locationListenerRef = useRef(locationListener);

      // If you want to stop watching the location after a specific time, you can use setTimeout
      // setTimeout(() => {
      //   locationListenerRef.current.remove();
      // }, YOUR_TIMEOUT);
    } catch (error) {
      handleOpen();
      setErrorMsg("Error getting location");
      setCheckData({
        message: "Cannot get your location!",
        status: null,
      });
      setLoad(false);
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }

  const HandleCheckAttendance = async (check: string) => {
    setScanType(check);
    handleCheckOpen();
  };

  useEffect(() => {
    if (errorMsg === "Permission to access location was denied.") {
      Alert.alert("Oop!", "Permission to access location was denied.");
    } else if (errorMsg === "Error getting location") {
      Alert.alert("Error getting location");
    }
  }, [errorMsg]);

  if (errorMsg) {
    return (
      <View
        style={[
          LeaveStyle.LeaveContainer,
          {
            borderTopLeftRadius: moderateScale(15),
            borderTopRightRadius: moderateScale(15),
            borderTopWidth: moderateScale(1),
            borderRightWidth: moderateScale(1),
            borderLeftWidth: moderateScale(1),
          },
        ]}
      >
        <View style={LeaveStyle.LeaveBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={[LeaveStyle.LeaveBackButton, { padding: moderateScale(15) }]}
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
              Leave Check
            </Text>
          </TouchableOpacity>
        </View>
        <View style={CheckStyle.LeaveErrorConainer}>
          <TouchableOpacity
            onPress={() => {
              handleLocationPermission();
            }}
            style={{
              backgroundColor: "#082b9e",
              padding: moderateScale(10),
              marginTop: moderateScale(5),
            }}
          >
            <Text
              style={[
                CheckStyle.LeaveErrorTitle,
                { fontSize: moderateScale(16) },
              ]}
            >
              Permission to access location was denied.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <>
        {/* ============= Ask For Check Attendance ============= */}
        <Modal
          visible={CheckIsVisible}
          animationType="none"
          onRequestClose={handleCheckClose}
          transparent={true}
        >
          <View style={ModalStyle.ModalContainer}>
            <TouchableOpacity
              style={ModalStyle.ModalBackgroundOpacity}
              onPress={handleCheckClose}
              activeOpacity={0.2}
            />
            <View
              style={[
                ModalStyle.ModalButtonContainerMain,
                {
                  height: moderateScale(200),
                  borderRadius: moderateScale(10),
                  borderWidth: moderateScale(1),
                },
              ]}
            >
              <View
                style={[
                  ModalStyle.ModalButtonTextTitleContainerMain,
                  { padding: moderateScale(20) },
                ]}
              >
                <Text
                  style={[
                    ModalStyle.ModalButtonTextTitleMain,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  {scanType === "checkIn"
                    ? "Do you want to check in?"
                    : "Do you want to check out?"}
                </Text>
              </View>

              <View style={ModalStyle.ModalButtonOptionContainer}>
                <TouchableOpacity
                  onPress={() => handleCheckClose()}
                  style={[
                    ModalStyle.ModalButtonOptionLeft,
                    {
                      padding: moderateScale(15),
                      borderTopWidth: moderateScale(1),
                    },
                  ]}
                >
                  <Text
                    style={[
                      ModalStyle.ModalButtonTextTitleMain,
                      { fontSize: moderateScale(16) },
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCheckClose();
                    getLocation();
                  }}
                  style={[
                    ModalStyle.ModalButtonOptionLeft,
                    {
                      padding: moderateScale(15),
                      borderLeftWidth: moderateScale(1),
                      borderTopWidth: moderateScale(1),
                    },
                  ]}
                >
                  <Text
                    style={[
                      ModalStyle.ModalButtonTextTitleMain,
                      { fontSize: moderateScale(16) },
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ============= Alert After Check Attendance ============= */}
        <CheckModal
          location={location}
          isVisible={isVisible}
          handleClose={handleClose}
          data={checkData}
          load={load}
        />
        <View
          style={[
            CheckStyle.CheckContainer,
            {
              borderTopLeftRadius: moderateScale(15),
              borderTopRightRadius: moderateScale(15),
              borderTopWidth: moderateScale(1),
              borderRightWidth: moderateScale(1),
              borderLeftWidth: moderateScale(1),
            },
          ]}
        >
          <View style={LeaveStyle.LeaveBackButtonContainer}>
            <TouchableOpacity
              onPress={() => navigate("/home")}
              style={[
                LeaveStyle.LeaveBackButton,
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
                  LeaveStyle.LeaveBackButtonTitle,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Check In/Out
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              backgroundColor: "#f8f8f8",
              padding: moderateScale(10),
              borderRadius: moderateScale(10),
              borderWidth: moderateScale(1),
              borderColor: "#dcdcdc",
            }}
            style={{
              flex: 1,
              width: "100%",
              padding: moderateScale(10),
            }}
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
                Select Shifts
              </Text>
            </View>
            <View style={CheckStyle.CheckMainSelectDateSection}>
              <TouchableOpacity
                style={[
                  CheckStyle.CheckMainSelectDateButton,
                  {
                    height: moderateScale(40),
                    marginRight: moderateScale(10),
                    paddingHorizontal: moderateScale(10),
                    borderRadius: moderateScale(10),
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
                  Morning
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  CheckStyle.CheckMainSelectDateButton,
                  {
                    height: moderateScale(40),
                    marginRight: moderateScale(10),
                    borderRadius: moderateScale(10),
                  },
                ]}
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
                  Afternoon
                </Text>
              </TouchableOpacity>
            </View>
            {getCheckInOutButtonData?.getCheckInOutButton?.checkIn ? (
              <TouchableOpacity
                style={[
                  CheckStyle.CheckInButtonContainer,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                    marginVertical: moderateScale(10),
                  },
                ]}
                onPress={async () => {
                  HandleCheckAttendance("checkIn");
                }}
              >
                <Text
                  style={[
                    CheckStyle.CheckButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  CHECK IN
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  CheckStyle.CheckOutDisableButtonContainer,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                    marginVertical: moderateScale(10),
                  },
                ]}
              >
                <Text
                  style={[
                    CheckStyle.CheckButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  CHECK IN
                </Text>
              </View>
            )}
            {getCheckInOutButtonData?.getCheckInOutButton?.checkOut ? (
              <TouchableOpacity
                style={[
                  CheckStyle.CheckOutButtonContainer,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
                onPress={() => {
                  HandleCheckAttendance("checkOut");
                }}
              >
                <Text
                  style={[
                    CheckStyle.CheckButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  CHECK OUT
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  CheckStyle.CheckInDisableButtonContainer,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
              >
                <Text
                  style={[
                    CheckStyle.CheckButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  CHECK OUT
                </Text>
              </View>
            )}

            <View
              style={[
                CheckStyle.CheckOutLocationFullContainer,
                { height: moderateScale(100) },
              ]}
            >
              <View
                style={[
                  CheckStyle.CheckOutLocationContainer,
                  {
                    padding: moderateScale(10),
                    marginTop: moderateScale(10),
                    borderColor:
                      distance <=
                      employeeData?.getEmployeeById?.checkAttendanceDistance
                        ? "green"
                        : "red",
                  },
                ]}
              >
                <Text
                  style={[
                    CheckStyle.CheckOutLocationTitle,
                    {
                      fontSize: moderateScale(14),
                      color:
                        distance <=
                        employeeData?.getEmployeeById?.checkAttendanceDistance
                          ? "green"
                          : "red",
                    },
                  ]}
                >
                  {distance <=
                  employeeData?.getEmployeeById?.checkAttendanceDistance
                    ? "Coordinates are within the specified range."
                    : `Coordinates are outside (${
                        distance -
                        employeeData?.getEmployeeById?.checkAttendanceDistance
                      }m)  the specified range.`}
                </Text>

                <Text
                  style={[
                    CheckStyle.CheckOutLocationBody,
                    {
                      fontSize: moderateScale(12),
                      color:
                        // location?.coords.latitude || locate?.coords.latitude
                        distance <=
                        employeeData?.getEmployeeById?.checkAttendanceDistance
                          ? "green"
                          : "red",
                      paddingTop: moderateScale(10),
                    },
                  ]}
                >
                  Latitude:{" "}
                  {locate?.coords.latitude ? locate?.coords.latitude : ""},
                  {"\n"}Longitude:{" "}
                  {locate?.coords.longitude ? locate?.coords.longitude : ""}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  CheckStyle.CheckOutLocationRefetchButton,
                  { borderRadius: moderateScale(10) },
                ]}
                onPress={() => {
                  getLocation();
                }}
              >
                <Image
                  source={
                    distance <=
                    employeeData?.getEmployeeById?.checkAttendanceDistance
                      ? require("../assets/Images/allowlocation.gif")
                      : require("../assets/Images/redlocation.gif")
                  }
                  style={[
                    CheckStyle.CheckOutLocationRefetchIcon,
                    {
                      width: moderateScale(40),
                      height: moderateScale(40),
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}
