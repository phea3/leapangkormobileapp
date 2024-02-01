import { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useLocation, useNavigate } from "react-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@apollo/client";
import ImageView from "react-native-image-viewing";
import Constants from "expo-constants";

import ProfileStyle from "../styles/ProfileStyle.scss";
import ModalStyle from "../styles/ModalStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import auth from "../Auth/auth";
import useLoginUser from "../Hook/useLoginUser";
import { GET_USER_INFO } from "../graphql/GetUserInfo";
import * as Animatable from "react-native-animatable";
import { moderateScale } from "../ Metrics";
import getAppVersion from "../getAppVersion";
import { AppVersions } from "../functions/FetchDataLocalStorage";

export default function ProfileScreen({ versionData }: any) {
  const location = useLocation();
  const { dimension } = useContext(AuthContext);
  const [isVisible, setVisible] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [versions, setVersions] = useState<AppVersions | null>(null);

  useEffect(() => {
    const fetchAppVersion = async () => {
      const appVersions = await getAppVersion();
      if (appVersions !== undefined) {
        setVersions(appVersions);
        // console.log(versions);
      }
    };
    fetchAppVersion();
  }, []);
  // console.log(versionData);

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleOpenModal = () => {
    setVisible(true);
  };

  const navigate = useNavigate();
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();

  const Logouthandle = async () => {
    await auth.logout().then(async (result) => {
      await AsyncStorage.removeItem("@userToken");
      await AsyncStorage.removeItem("@userUid");
      dispatch({
        type: REDUCER_ACTIONS.LOGOUT,
      });
      navigate("/");
    });
  };

  const { data, refetch } = useQuery(GET_USER_INFO, {
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <View style={ProfileStyle.ProfileContainer}>
        <View
          style={{
            width: "100%",
            height: "85%",
            position: "absolute",
            backgroundColor: "white",
          }}
        />
        <View style={ProfileStyle.ProfileTopContainer}>
          <View style={ProfileStyle.ProfileFirstTopContainer} />
          <View
            style={[
              ProfileStyle.ProfileSecondTopContainer,
              {
                borderTopLeftRadius: moderateScale(15),
                borderTopRightRadius: moderateScale(15),
                borderTopWidth: moderateScale(1),
                borderLeftWidth: moderateScale(1),
                borderRightWidth: moderateScale(1),
              },
            ]}
          >
            <Text
              style={[ProfileStyle.UserName, { fontSize: moderateScale(14) }]}
            >
              {data?.getUserInfoMobile?.latinName
                ? data?.getUserInfoMobile?.latinName
                : "--:--"}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{ position: "absolute" }}
            onPress={() => {
              if (data?.getUserInfoMobile?.profileImage) {
                setIsVisible(true);
              }
            }}
          >
            <Animatable.Image
              animation={"fadeIn"}
              resizeMode="cover"
              source={
                data?.getUserInfoMobile?.profileImage
                  ? { uri: data?.getUserInfoMobile?.profileImage }
                  : require("../assets/Images/user.png")
              }
              style={[
                ProfileStyle.ImageUser,
                {
                  width: moderateScale(100),
                  height: moderateScale(100),
                  borderWidth: moderateScale(2),
                },
              ]}
            />
          </TouchableOpacity>
          <ImageView
            images={[
              data?.getUserInfoMobile?.profileImage
                ? {
                    uri: data?.getUserInfoMobile?.profileImage,
                  }
                : require("../assets/Images/user.png"),
            ]}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
        </View>
        <View
          style={[
            ProfileStyle.ProfileBodyContainer,
            {
              borderRightWidth: moderateScale(1),
              borderLeftWidth: moderateScale(1),
            },
          ]}
        >
          <View>
            <Text
              style={[
                ProfileStyle.UserPosition,
                {
                  fontSize: moderateScale(12),
                  lineHeight: moderateScale(35),
                },
              ]}
            >
              Position:{" "}
              {data?.getUserInfoMobile?.position
                ? data?.getUserInfoMobile?.position
                : "--:--"}
            </Text>
          </View>
          <View style={ProfileStyle.LogoutContainer}>
            <View
              style={{
                flex: 1,
                width: "90%",
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: moderateScale(15),
              }}
            >
              {!versionData ? (
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === "ios") {
                      Linking.openURL(
                        "https://apps.apple.com/kh/app/leap-angkor-human-resource/id6474982219"
                      );
                    } else {
                      Linking.openURL(
                        "https://play.google.com/store/apps/details?id=com.leapangkor.humanresource"
                      );
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../assets/Images/alerting.gif")}
                    style={{
                      width: moderateScale(50),
                      height: moderateScale(50),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      fontFamily: "Kantumruy-Light",
                      color: "#3C6EFB",
                    }}
                  >
                    Quick update {">>>"}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={[
                ProfileStyle.LogoutScreenLogoutButton,
                {
                  borderRadius: moderateScale(10),
                  padding: moderateScale(10),
                  marginVertical: moderateScale(10),
                },
              ]}
              onPress={() => {
                handleOpenModal();
              }}
            >
              <Text
                style={[
                  ProfileStyle.LogoutScreenLogoutButtonText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* ========================START MODAL ALERT============================ */}
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleCloseModal}
        transparent={true}
      >
        <View style={ModalStyle.ModalContainer}>
          <TouchableOpacity
            style={ModalStyle.ModalBackgroundOpacity}
            onPress={handleCloseModal}
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
                Do you want to logout?
              </Text>
            </View>

            <View style={ModalStyle.ModalButtonOptionContainer}>
              <TouchableOpacity
                onPress={() => handleCloseModal()}
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
                  handleCloseModal();
                  Logouthandle();
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
      {/* ========================START MODAL ALERT============================ */}
    </>
  );
}
