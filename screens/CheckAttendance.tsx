import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
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

export default function ChecKAttendance({ locate }: any) {
  const { uid } = useContext(AuthContext);
  const navigate = useNavigate();
  const located = useLocation();
  const [isVisible, setVisible] = useState(false);
  const [CheckIsVisible, setCheckVisible] = useState(false);
  const [scanType, setScanType] = useState("");
  const { dimension } = useContext(AuthContext);
  const [checkData, setCheckData] = useState({
    message: "",
    status: false,
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);

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
    navigate("/attendance");
    setVisible(false);
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

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    // Get the current location
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setErrorMsg("Error getting location");
    }
  }

  useEffect(() => {
    getLocation();
  }, [located.pathname]);

  // console.log(locate);
  const [employeeCheckAttendance] = useMutation(EMPLOYEECHECKATTENDANCE);

  const HandleCheckAttendance = async (check: string) => {
    setScanType(check);
    handleCheckOpen();
  };

  const CheckInOut = async () => {
    let createValue = {
      longitude: locate?.coords.longitude
        ? locate?.coords.longitude.toString()
        : "",
      latitude: locate?.coords.latitude
        ? locate?.coords.latitude.toString()
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
        setCheckData({
          message: data?.employeeCheckAttendance?.message,
          status: data?.employeeCheckAttendance?.status,
        });
        if (checkData) {
          handleOpen();
        }
      },
      onError(error: any) {
        // console.log("Fail", error?.message);
        setCheckData({
          message: error?.message,
          status: error?.status,
        });
        handleOpen();
      },
    });
  };

  if (errorMsg) {
    return (
      <View style={LeaveStyle.LeaveContainer}>
        <View style={LeaveStyle.LeaveBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={
              dimension === "sm"
                ? LeaveStyle.LeaveBackButtonSM
                : LeaveStyle.LeaveBackButton
            }
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
              Leave Check
            </Text>
          </TouchableOpacity>
        </View>
        <View style={CheckStyle.LeaveErrorConainer}>
          <TouchableOpacity
            onPress={() => {
              handleLocationPermission();
            }}
            style={{ backgroundColor: "#082b9e", padding: 10, marginTop: 5 }}
          >
            <Text
              style={[
                CheckStyle.LeaveErrorTitle,
                { fontSize: dimension === "sm" ? 12 : 16 },
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
            <View style={ModalStyle.ModalButtonContainerMain}>
              <View style={ModalStyle.ModalButtonTextTitleContainerMain}>
                <Text
                  style={
                    dimension === "sm"
                      ? ModalStyle.ModalButtonTextTitleMainSM
                      : ModalStyle.ModalButtonTextTitleMain
                  }
                >
                  Do you want to check in/out?
                </Text>
              </View>

              <View style={ModalStyle.ModalButtonOptionContainer}>
                <TouchableOpacity
                  onPress={() => handleCheckClose()}
                  style={ModalStyle.ModalButtonOptionLeft}
                >
                  <Text
                    style={
                      dimension === "sm"
                        ? ModalStyle.ModalButtonTextTitleMainSM
                        : ModalStyle.ModalButtonTextTitleMain
                    }
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCheckClose();
                    CheckInOut();
                  }}
                  style={[
                    ModalStyle.ModalButtonOptionLeft,
                    { borderLeftWidth: 1 },
                  ]}
                >
                  <Text
                    style={
                      dimension === "sm"
                        ? ModalStyle.ModalButtonTextTitleMainSM
                        : ModalStyle.ModalButtonTextTitleMain
                    }
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
          isVisible={isVisible}
          handleClose={handleClose}
          data={checkData}
        />
        <View style={CheckStyle.CheckContainer}>
          <View style={LeaveStyle.LeaveBackButtonContainer}>
            <TouchableOpacity
              onPress={() => navigate("/home")}
              style={
                dimension === "sm"
                  ? LeaveStyle.LeaveBackButtonSM
                  : LeaveStyle.LeaveBackButton
              }
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
                Check In/Out
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              backgroundColor: "#f8f8f8",
              padding: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#dcdcdc",
            }}
            style={{
              flex: 1,
              width: "100%",
              padding: 10,
            }}
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
                Select Shifts
              </Text>
            </View>
            <View style={CheckStyle.CheckMainSelectDateSection}>
              <TouchableOpacity
                style={[
                  CheckStyle.CheckMainSelectDateButton,
                  {
                    marginRight: 10,
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
                style={CheckStyle.CheckMainSelectDateButton}
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
            <TouchableOpacity
              style={
                dimension === "sm"
                  ? CheckStyle.CheckInButtonContainerSM
                  : CheckStyle.CheckInButtonContainer
              }
              onPress={async () => {
                HandleCheckAttendance("checkIn");
              }}
            >
              <Text
                style={
                  dimension === "sm"
                    ? CheckStyle.CheckButtonTextSM
                    : CheckStyle.CheckButtonText
                }
              >
                CHECK IN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                dimension === "sm"
                  ? CheckStyle.CheckOutButtonContainerSM
                  : CheckStyle.CheckOutButtonContainer
              }
              onPress={() => {
                HandleCheckAttendance("checkOut");
              }}
            >
              <Text
                style={
                  dimension === "sm"
                    ? CheckStyle.CheckButtonTextSM
                    : CheckStyle.CheckButtonText
                }
              >
                CHECK OUT
              </Text>
            </TouchableOpacity>
            <View style={CheckStyle.CheckOutLocationFullContainer}>
              <View
                style={[
                  CheckStyle.CheckOutLocationContainer,
                  {
                    padding: 10,
                    marginTop: 10,
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
                    dimension === "sm"
                      ? CheckStyle.CheckOutLocationTitleSM
                      : CheckStyle.CheckOutLocationTitle,
                    {
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
                    dimension === "sm"
                      ? CheckStyle.CheckOutLocationBodySM
                      : CheckStyle.CheckOutLocationBody,
                    {
                      color:
                        // location?.coords.latitude || locate?.coords.latitude
                        distance <=
                        employeeData?.getEmployeeById?.checkAttendanceDistance
                          ? "green"
                          : "red",
                      paddingTop: 10,
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
                style={
                  dimension === "sm"
                    ? CheckStyle.CheckOutLocationRefetchButtonSM
                    : CheckStyle.CheckOutLocationRefetchButton
                }
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
                  style={
                    dimension === "sm"
                      ? CheckStyle.CheckOutLocationRefetchIconSM
                      : CheckStyle.CheckOutLocationRefetchIcon
                  }
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
