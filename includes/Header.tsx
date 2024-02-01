import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderStyle from "../styles/HeaderStyle.scss";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import {
  fetchDataLocalStorage,
  initMobileUserLogin,
} from "../functions/FetchDataLocalStorage";
import Back from "./Back";
import { moderateScale } from "../ Metrics";
import {
  getLanguage,
  setDefaultLanguage,
  setDefaultTranslations,
  setLanguage,
  setTranslations,
  useTranslation,
} from "react-multi-lang";
import en from "../translations/en.json";
import kh from "../translations/kh.json";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import * as Animatable from "react-native-animatable";

setTranslations({ en, kh });
setDefaultLanguage("kh");

const ChangeEng = () => {
  setLanguage("en");
};

const ChangeKh = () => {
  setLanguage("kh");
};

export default function Header({ versionData }: any) {
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);
  const t = useTranslation();
  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useMemo(() => {
    fetchDataLocalStorage("@mobileUserLogin").then((value) => {
      let mobileUser: string = value;
      let mobileUserLoginData = JSON.parse(mobileUser);
      // console.log(mobileUserLoginData);
      setMobileUserLogin({
        _id: mobileUserLoginData?.user?._id,
        firstName: mobileUserLoginData?.user?.firstName,
        lastName: mobileUserLoginData?.user?.lastName,
        englishName: mobileUserLoginData?.user?.latinName,
        profileImg: mobileUserLoginData?.user?.profileImage,
        role: mobileUserLoginData?.user?.role,
      });
    });
  }, [location.pathname]);

  if (location.pathname === "/load") {
    return null;
  }

  // console.log(location.pathname);

  return (
    <View
      style={
        location.pathname === "/notification/action" ||
        location.pathname === "/notification/meeting" ||
        location.pathname === "/notification"
          ? HeaderStyle.HeaderContainer1
          : HeaderStyle.HeaderContainer
      }
    >
      <View style={HeaderStyle.HeaderInSideContainer}>
        {location.pathname === "/notification/action" ||
        location.pathname === "/notification/meeting" ||
        location.pathname === "/notification" ? (
          <View style={HeaderStyle.HeaderLeftFullSideContainer}>
            <TouchableOpacity
              style={
                dimension === "sm"
                  ? HeaderStyle.HeaderLeftSideContainerSM
                  : HeaderStyle.HeaderLeftSideContainer
              }
              onPress={() => {
                navigate("/home");
              }}
            >
              <Image
                source={require("../assets/Images/back-dark-blue.png")}
                style={{
                  width: moderateScale(22),
                  height: moderateScale(22),
                  margin: moderateScale(8),
                }}
              />
              <View style={{ padding: moderateScale(5) }}>
                <Text
                  style={[
                    HeaderStyle.HeaderTitle1Blue,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {t("NOTIFICATIONS")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {location.pathname === "/profile" ? (
              <View
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderLeftSideContainerSM
                    : HeaderStyle.HeaderLeftSideContainer
                }
              >
                <TouchableOpacity
                  onPress={() => navigate(-1)}
                  style={[
                    HeaderStyle.ProfileBackButton,
                    { padding: moderateScale(10) },
                  ]}
                >
                  <Image
                    source={require("../assets/Images/back-white.png")}
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <Text
                    style={[
                      HeaderStyle.ProfileBackButtonTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Profile")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => navigate("/profile")}
              style={{
                display: location.pathname === "/profile" ? "none" : "flex",
              }}
            >
              <View
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderLeftSideContainerSM
                    : HeaderStyle.HeaderLeftSideContainer
                }
              >
                <Image
                  source={
                    mobileUserLogin?.profileImg
                      ? { uri: mobileUserLogin?.profileImg }
                      : require("../assets/Images/user.png")
                  }
                  style={[
                    HeaderStyle.HeaderUserProfileImage,
                    {
                      height: moderateScale(40),
                      width: moderateScale(40),
                      margin: moderateScale(8),
                    },
                  ]}
                />
                <View style={HeaderStyle.HeaderTitleContainer}>
                  <Text
                    style={[
                      HeaderStyle.HeaderTitle1,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {t("Hi")} {mobileUserLogin?.englishName}!
                  </Text>
                  <Text
                    style={[
                      HeaderStyle.HeaderTitle2,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {t("View Profile")}
                    {" >"}
                  </Text>
                  <Text
                    style={[
                      {
                        fontSize: moderateScale(11),
                        fontFamily: "Kantumruy-Regular",
                        color: !versionData ? "orange" : "#66FF66",
                      },
                    ]}
                  >
                    {!versionData ? t("Need update!!!") : t("ទាន់សម័យ។")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}

        {location.pathname === "/notification" ||
        location.pathname === "/notification/action" ||
        location.pathname === "/notification/meeting" ? null : (
          <View
            style={[
              HeaderStyle.HeaderRightSideContainer,
              {
                padding: moderateScale(5),
              },
            ]}
          >
            {!versionData ? (
              <TouchableOpacity
                style={[
                  HeaderStyle.HeaderRightSideContainer,
                  { marginRight: moderateScale(10) },
                ]}
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
              >
                <Image
                  source={require("../assets/Images/alerting.gif")}
                  style={{
                    height: moderateScale(30),
                    width: moderateScale(30),
                    borderWidth: moderateScale(1),
                    borderColor: "cyan",
                    borderRadius: moderateScale(12),
                    marginRight: moderateScale(5),
                  }}
                />
              </TouchableOpacity>
            ) : null}
            <View
              style={[
                HeaderStyle.HeaderRightSideContainer,
                { marginRight: moderateScale(10) },
              ]}
            >
              <Menu>
                <MenuTrigger>
                  {getLanguage() === "kh" ? (
                    <Image
                      source={require("../assets/Images/Cambodia-Flag.png")}
                      style={{
                        width: moderateScale(25),
                        height: moderateScale(25),
                      }}
                    />
                  ) : (
                    <Image
                      source={require("../assets/Images/English-Flag.png")}
                      style={{
                        width: moderateScale(25),
                        height: moderateScale(25),
                      }}
                    />
                  )}
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => ChangeEng()}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: moderateScale(5),
                      }}
                    >
                      <Text
                        style={[
                          HeaderStyle.headerTitle3,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {t("English")}
                      </Text>
                      <Image
                        source={require("../assets/Images/English-Flag.png")}
                        style={{
                          width: moderateScale(25),
                          height: moderateScale(25),
                        }}
                      />
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={() => ChangeKh()}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: moderateScale(5),
                        borderTopWidth: 1,
                        borderColor: "#dcdcdc",
                      }}
                    >
                      <Text
                        style={[
                          HeaderStyle.headerTitle3,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {t("Khmer")}
                      </Text>
                      <Image
                        source={require("../assets/Images/Cambodia-Flag.png")}
                        style={{
                          width: moderateScale(25),
                          height: moderateScale(25),
                        }}
                      />
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>

            <TouchableOpacity
              style={HeaderStyle.HeaderRightSideContainer}
              onPress={() => navigate("/notification")}
            >
              <Image
                source={require("../assets/Images/bell.png")}
                style={{
                  height: moderateScale(30),
                  width: moderateScale(30),
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
