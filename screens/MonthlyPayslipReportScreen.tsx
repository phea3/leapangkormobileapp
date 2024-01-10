import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import PayslipStyle from "../styles/PayslipStyle.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-native";
import moment from "moment";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";

export default function MonthlyPayslipReportScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const scrollViewRef = useRef<ScrollView>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
  const [eye, setEye] = useState(false);

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    try {
      const { status } = await requestMediaLibraryPermissionsAsync();
      setMediaLibraryPermission(status === "granted");
    } catch (error) {
      console.error("Error requesting media library permission:", error);
    }
  };

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerResult | null>(null);

  const openMediaLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result);
      }
    } catch (error) {
      Alert.alert("Error", "There was an error accessing the media library.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      shareImage();
    }
  }, [selectedImage]);

  const shareImage = async () => {
    try {
      if (
        selectedImage &&
        selectedImage.assets &&
        selectedImage.assets.length > 0
      ) {
        // Use the first asset in the array
        const firstAsset = selectedImage.assets[0];
        await Share.share({ url: firstAsset.uri });
      } else {
        Alert.alert(
          "No Image Selected",
          "Please select an image before sharing."
        );
      }
    } catch (error) {
      Alert.alert("Error", "There was an error sharing the image.");
      console.error(error);
    }
  };

  const captureScrollView = async () => {
    try {
      if (!mediaLibraryPermission) {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access the media library."
        );
        return;
      }

      if (scrollViewRef.current) {
        const uri = await captureRef(scrollViewRef, {
          format: "jpg",
          quality: 0.8,
        });

        // Save the captured image to the device's media library
        const asset = await MediaLibrary.createAssetAsync(uri);
        MediaLibrary.createAlbumAsync("ExpoScrollViewExport", asset)
          .then(() => {
            console.log("Image saved to ExpoScrollViewExport album");
            // Prompt user to open the gallery manually
            Alert.alert(
              "Image Saved",
              "Image saved to your album. Open the gallery app to view & share it.",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    openMediaLibrary();
                  },
                },
              ]
            );
          })
          .catch((error) => {
            console.log("Error saving image to album:", error);
          });
      }
    } catch (error) {
      console.log("Error capturing ScrollView:", error);
    }
  };

  return (
    <View style={MeetingStyle.MeetingContainer}>
      <View style={MeetingStyle.MeetingBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/payslip")}
          style={
            dimension === "sm"
              ? MeetingStyle.MeetingBackButtonSM
              : MeetingStyle.MeetingBackButton
          }
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={
              dimension === "sm"
                ? MeetingStyle.MeetingBackButtonIconSM
                : MeetingStyle.MeetingBackButtonIcon
            }
          />
          <Text
            style={
              dimension === "sm"
                ? MeetingStyle.MeetingBackButtonTitleSM
                : MeetingStyle.MeetingBackButtonTitle
            }
          >
            PAYSLIP MONTHLY
          </Text>
        </TouchableOpacity>
      </View>
      <View style={PayslipStyle.MonthlyPayslipBodyContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%",
            borderRadius: 15,
          }}
        >
          <View style={PayslipStyle.MonthlyPayslipEmployeeCard}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/Images/user_phoem.jpg")}
                style={{
                  width: 80,
                  height: 80,
                  marginRight: 10,
                  borderRadius: 100,
                }}
              />
            </View>
            <View style={{ flex: 2 }}>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipDataBody}>
                    ID No:
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossBody}>
                    131366BSR
                  </Text>
                </View>
              </View>

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipDataBody}>Name:</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossBody}>
                    Pheak Makara
                  </Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipDataBody}>
                    Designation:
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossBody}>
                    Graphic Design
                  </Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipDataBody}>
                    A/C No:
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossBody}>
                    002 272 274
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={PayslipStyle.MonthlyPayslipEmployeeCard}>
            <View style={{ flex: 2 }}>
              <View
                style={
                  PayslipStyle.MonthlyPayslipGrossSalaryEmployeeContentCard
                }
              >
                <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                  Gross Salary
                </Text>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {eye ? (
                    <Text
                      style={[
                        PayslipStyle.MonthlyPayslipGrossSalaryTitle,
                        {
                          height: 30,
                        },
                      ]}
                    >
                      $339.42
                    </Text>
                  ) : (
                    <Image
                      resizeMode="repeat"
                      source={require("../assets/Images/censored.jpeg")}
                      style={{ height: 30, width: 80, paddingRight: 10 }}
                    />
                  )}

                  <TouchableOpacity onPress={() => setEye(!eye)}>
                    <Image
                      source={
                        eye
                          ? require("../assets/Images/view.png")
                          : require("../assets/Images/hide.png")
                      }
                      style={
                        dimension === "sm"
                          ? { width: 20, height: 20 }
                          : { width: 25, height: 25 }
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <View style={PayslipStyle.MonthlyPayslipGrossEmployeeContentCard}>
                <Text style={PayslipStyle.MonthlyPayslipDataBody}>
                  Payslip For Month
                </Text>
                <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                  of May 2023
                </Text>
              </View>
              <View style={PayslipStyle.MonthlyPayslipGrossEmployeeContentCard}>
                <Text style={PayslipStyle.MonthlyPayslipDataBody}>Date: </Text>
                <Text style={PayslipStyle.MonthlyPayslipGrossBody}>
                  {moment(new Date()).format("Do, MMM YYYY")}
                </Text>
              </View>
            </View>
          </View>
          <View style={PayslipStyle.MonthlyPayslipEmployeeCard}>
            <View style={{ flex: 1 }}>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    Salary
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    Days
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    Hours
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    Amount
                  </Text>
                </View>
              </View>

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Salary-Regular Day</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>22</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>176</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>253.85</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Salary-Night Shift</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text> </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text> </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text> </Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Salary-Public Holiday</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Annual Leave</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Sick Leave</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Special Leave</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Maternity Leave</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Overtime-Public Holiday</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Overtime-Off Leave</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>3</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>24</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>51.92</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Overtime-Regular Leave</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Overtime-Early Flight</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>0.00</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text>0</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text></Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Other allowance</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>33.65</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    TOTAL
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>25</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextCenter}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>200</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    339.42
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={PayslipStyle.MonthlyPayslipEmployeeCard}>
            <View style={{ flex: 1 }}>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    Withholding
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    Amount
                  </Text>
                </View>
              </View>

              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Resign</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Resign</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Funeral</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Tax</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>NSSF pension</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Other</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text></Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Training</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Bank Charge</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text>Half-Month Salary Paid</Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text>$0</Text>
                </View>
              </View>
              <View style={PayslipStyle.MonthlyPayslipEmployeeContentCard}>
                <View style={{ flex: 2 }}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>
                    TOTAL
                  </Text>
                </View>
                <View style={PayslipStyle.MonthlyPayslipContentTextRight}>
                  <Text style={PayslipStyle.MonthlyPayslipGrossTitle}>$0</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* <TouchableOpacity
          onPress={captureScrollView}
          style={{
            position: "absolute",
            bottom: 40,
            right: 20,
            backgroundColor: "blue",
            padding: 15,
            borderRadius: 100,
          }}
        >
          <Image
            source={require("../assets/Images/screenshot.png")}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
