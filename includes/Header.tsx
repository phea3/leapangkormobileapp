import { Image, Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "../styles/HeaderStyle.scss";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import {
  fetchDataLocalStorage,
  initMobileUserLogin,
} from "../functions/FetchDataLocalStorage";
import Back from "./Back";

export default function Header() {
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);

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
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderBackIconSM
                    : HeaderStyle.HeaderBackIcon
                }
              />
              <View
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderTitleContainerSM
                    : HeaderStyle.HeaderTitleContainer
                }
              >
                <Text
                  style={
                    dimension === "sm"
                      ? HeaderStyle.HeaderTitle1BlueSM
                      : HeaderStyle.HeaderTitle1Blue
                  }
                >
                  NOTIFICATIONS
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
                  style={HeaderStyle.ProfileBackButton}
                >
                  <Image
                    source={require("../assets/Images/back-white.png")}
                    style={HeaderStyle.ProfileBackButtonIcon}
                  />
                  <Text style={HeaderStyle.ProfileBackButtonTitle}>
                    Profile
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
                  style={
                    dimension === "sm"
                      ? HeaderStyle.HeaderUserProfileImageSM
                      : HeaderStyle.HeaderUserProfileImage
                  }
                />
                <View
                  style={
                    dimension === "sm"
                      ? HeaderStyle.HeaderTitleContainerSM
                      : HeaderStyle.HeaderTitleContainer
                  }
                >
                  <Text
                    style={
                      dimension === "sm"
                        ? HeaderStyle.HeaderTitle1SM
                        : HeaderStyle.HeaderTitle1
                    }
                  >
                    Hi {mobileUserLogin?.englishName}!
                  </Text>
                  <Text
                    style={
                      dimension === "sm"
                        ? HeaderStyle.HeaderTitle2SM
                        : HeaderStyle.HeaderTitle2
                    }
                  >
                    View Profile{" >"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}
        {location.pathname === "/notification" ||
        location.pathname === "/notification/action" ||
        location.pathname === "/notification/meeting" ? null : (
          <TouchableOpacity
            style={HeaderStyle.HeaderRightSideContainer}
            onPress={() => navigate("/notification")}
          >
            <Image
              source={require("../assets/Images/bell.png")}
              style={
                dimension === "sm"
                  ? HeaderStyle.HeaderUserBellSM
                  : HeaderStyle.HeaderUserBell
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
