import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../color";
import { moderateScale } from "../ Metrics";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GETPUBLICHOLIDAYBYEMPLOYEE } from "../graphql/GetPublicHolidayByEmployee";
import { AuthContext } from "../Context/AuthContext";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";

export default function TimeoffScreen() {
  const { uid } = useContext(AuthContext);
  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [year, setYear] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const [TimeOffData, setTimeOffData] = useState([]);
  const { refetch: TimeOffRefetch } = useQuery(GETPUBLICHOLIDAYBYEMPLOYEE, {
    pollInterval: 2000,
    variables: {
      employeeId: !uid ? uid : "659f3c36029ca95bcc7be50d",
      year: moment(year).format("YYYY"),
    },
    onCompleted(data) {
      // console.log(data?.getPublicHolidayByEmployee);
      if (data) {
        setTimeOffData(
          data?.getPublicHolidayByEmployee?.filter(
            (e: any) => e.status === true
          )
        );
      } else {
        // Handle the case where data.getPublicHolidayByEmployee is not an array
        console.log("Invalid data format received");
      }
    },
    onError(error) {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    TimeOffRefetch();
  }, [year]);

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

  return (
    <View style={TimeOffStyles.container}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={[
            {
              padding: moderateScale(15),
              width: "50%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            },
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
          <Text style={TimeOffStyles.BackButtonTitle}>Time Off</Text>
        </TouchableOpacity>
        <View style={{ paddingRight: moderateScale(10) }}>
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
                    {
                      fontSize: moderateScale(12),
                      textAlign: "center",
                      fontFamily: "Kantumruy-Bold",
                      color: "#177a02",
                    },
                  ]}
                >
                  {selectedItem
                    ? moment(selectedItem).format("YYYY")
                    : moment(year).format("YYYY")}
                </Text>
              );
            }}
            dropdownStyle={{
              borderRadius: moderateScale(10),
              paddingHorizontal: moderateScale(10),
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
                  {moment(item).format("YYYY")}
                </Text>
              );
            }}
            buttonStyle={{
              width: moderateScale(100),
              height: moderateScale(30),
              backgroundColor: "#f8f8f8",
              borderRadius: moderateScale(10),
              borderWidth: moderateScale(1),
              borderColor: "#177a02",
              justifyContent: "center",
              alignContent: "center",
            }}
          />
        </View>
      </View>
      <View style={TimeOffStyles.TimeOffTitleContainer}>
        <View style={TimeOffStyles.TitleTextContainer}>
          <Text style={TimeOffStyles.TitleText}>Titile</Text>
        </View>
        <View style={TimeOffStyles.TitleTextContainer}>
          <Text style={TimeOffStyles.TitleText}>Days</Text>
        </View>
        <View style={TimeOffStyles.TitleTextContainer}>
          <Text style={TimeOffStyles.TitleText}>Remain</Text>
        </View>
        <View style={TimeOffStyles.TitleTextContainer}>
          <Text style={TimeOffStyles.TitleText}>Year</Text>
        </View>
      </View>
      {load ? (
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: COLORS.WHITE,
            alignItems: "center",
            justifyContent: "center",
          }}
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
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {TimeOffData.map((data: any, index: number) => (
            <View style={TimeOffStyles.TimeOffRowContainer} key={index}>
              <View style={TimeOffStyles.TitleTextContainer}>
                <Text style={TimeOffStyles.RowText}>{data?.title}</Text>
              </View>
              <View style={TimeOffStyles.TitleTextContainer}>
                <Text style={TimeOffStyles.RowText}>{data?.totalDay}</Text>
              </View>
              <View style={TimeOffStyles.TitleTextContainer}>
                <Text style={TimeOffStyles.RowText}>{data?.remain}</Text>
              </View>
              <View style={TimeOffStyles.TitleTextContainer}>
                <Text style={TimeOffStyles.RowText}>{data?.year}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const TimeOffStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    borderTopWidth: moderateScale(1),
    borderRightWidth: moderateScale(1),
    borderLeftWidth: moderateScale(1),
    alignItems: "center",
    borderColor: COLORS.GREEN,
  },
  BackButtonTitle: {
    textTransform: "uppercase",
    color: COLORS.DARK_GREEN,
    fontSize: moderateScale(14),
    fontFamily: "Kantumruy-Bold",
  },
  TimeOffTitleContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: COLORS.LIGHT_GREEN,
    height: moderateScale(40),
  },
  TimeOffRowContainer: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: COLORS.WHITE,
    height: moderateScale(40),
  },
  TitleTextContainer: {
    width: "25%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  TitleText: {
    fontFamily: "Kantumruy-Bold",
    fontSize: moderateScale(14),
    color: COLORS.DARK_GREEN,
  },
  RowText: {
    fontFamily: "Kantumruy-Regular",
    fontSize: moderateScale(12),
  },
});
