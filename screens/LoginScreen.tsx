import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import LoginStyle from "../styles/LoginStyle.scss";
import { useContext, useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import auth from "../Auth/auth";
import serviceAccount from "../Auth/keyService.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router";
import useUser from "../Hook/useLoginUser";
import { AuthContext } from "../Context/AuthContext";
import { useMutation } from "@apollo/client";
import { MOBILE_LOGIN } from "../graphql/MobileLogin";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(true);
  const { dispatch, REDUCER_ACTIONS } = useUser();
  const [eye, setEye] = useState(true);
  const [load, setLoad] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setLoad(false)
    }, 500);
  }, [])

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

  const [mobilelogin] = useMutation(MOBILE_LOGIN, {
    onError(error) {
      Alert.alert("Cannot login", error?.message);
    },
  });

  const handleLogin = async () => {
    await mobilelogin({
      variables: {
        email: email,
        password: password,
      },
      onCompleted(data) {
        // console.log(data);
        if (data?.mobileLogin?.status === true && data?.mobileLogin?.token) {
          AsyncStorage.setItem("@userToken", data?.mobileLogin?.token);
          AsyncStorage.setItem("@userUid", data?.mobileLogin?.user?._id);
          AsyncStorage.setItem("@gmail", email);
          AsyncStorage.setItem("@password", password);

          setTimeout(() => {
            navigate("/home");
            dispatch({
              type: REDUCER_ACTIONS.LOGIN,
              payload: {
                email: "example@user.com",
                token: data?.mobileLogin?.token ? data?.mobileLogin?.token : "",
                uid: data?.mobileLogin?.user?._id
                  ? data?.mobileLogin?.user?._id
                  : "",
              },
            });
          }, 1000);
        } else {
          Alert.alert(
            "Message",
            data?.mobileLogin?.message + "but session expired"
          );
        }
      },
    });
  };

  const login = async () => {
    await auth.createApp(
      serviceAccount.app_id,
      serviceAccount.key,
      serviceAccount.url
    );

    await auth.login(email, password).then((result) => {
      // console.log("result", result?.token);
      if (result?.status === true) {
        //======= Set Local Storage ======
        AsyncStorage.setItem("@userToken", result?.token);
        AsyncStorage.setItem("@userUid", result?.uid);
        AsyncStorage.setItem("@gmail", email);
        AsyncStorage.setItem("@password", password);

        setTimeout(() => {
          navigate("/home");
          dispatch({
            type: REDUCER_ACTIONS.LOGIN,
            payload: {
              email: "example@user.com",
              token: result?.token ? result?.token : "",
              uid: result?.uid ? result?.uid : "",
            },
          });
        }, 1000);
      } else {
        Alert.alert("Message", result?.message);
      }
    });
  };

  useEffect(() => {
    async function getAccount() {
      let userGmail = await AsyncStorage.getItem("@gmail");
      let userPassword = await AsyncStorage.getItem("@password");
      // console.log(userGmail + "\n" + userPassword);
      if (userGmail) {
        setEmail(userGmail);
      }
      if (userPassword) {
        setPassword(userPassword);
      }
    }
    getAccount();
  }, []);

  if(load){
    return <ActivityIndicator />
  }

  return (
    <View style={LoginStyle.LoginScreenContainer}>
      {!isKeyboardVisible && (
        <View
          style={
            isKeyboardVisible
              ? LoginStyle.LoginScreenTopContainerKB
              : LoginStyle.LoginScreenTopContainer
          }
        >
          <View
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenLogonImageContainerSM
                : LoginStyle.LoginScreenLogonImageContainer
            }
          >
            <Image
              source={require("../assets/Images/Logo-1.png")}
              resizeMode="contain"
              style={
                dimension === "sm"
                  ? LoginStyle.LoginScreenLoginStyleSM
                  : LoginStyle.LoginScreenLoginStyle
              }
            />
          </View>

          <Text
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenTitle1SM
                : LoginStyle.LoginScreenTitle1
            }
          >
            {/* សូមស្វាគមន៍!! */}
            Welcome Back!
          </Text>
          <Text
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenTitle2SM
                : LoginStyle.LoginScreenTitle2
            }
          >
            {/* ប្រព័ន្ធការគ្រប់គ្រងកម្មវិធីសាលាហ្គោឡូប៊ល់ */}
            Go Global Human Resource
          </Text>
        </View>
      )}
      <View
        style={
          isKeyboardVisible
            ? LoginStyle.LoginScreenMidContainerKB
            : LoginStyle.LoginScreenMidContainer
        }
      >
        <View
          style={
            dimension === "sm"
              ? LoginStyle.LoginScreenTextInputContainerSM
              : LoginStyle.LoginScreenTextInputContainer
          }
        >
          <Text
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenTextInputTextSM
                : LoginStyle.LoginScreenTextInputText
            }
          >
            {/* អ៉ីម៉ែល* */}
            Email*
          </Text>
          <View
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenTextInputBoxSM
                : LoginStyle.LoginScreenTextInputBox
            }
          >
            <TextInput
              value={email}
              placeholder="mail@gmail.com"
              style={
                dimension === "sm"
                  ? LoginStyle.LoginScreenTextInputTextSM
                  : LoginStyle.LoginScreenTextInputText
              }
              onChangeText={(e) => setEmail(e)}
              keyboardType="default"
            />
          </View>
        </View>
        <View
          style={
            dimension === "sm"
              ? LoginStyle.LoginScreenTextInputContainerSM
              : LoginStyle.LoginScreenTextInputContainer
          }
        >
          <Text
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenTextInputTextSM
                : LoginStyle.LoginScreenTextInputText
            }
          >
            {/* ពាក្យសម្ងាត់* */}
            Password*
          </Text>
          <View
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenTextInputBoxSM
                : LoginStyle.LoginScreenTextInputBox
            }
          >
            <TextInput
              value={password}
              placeholder="ពាក្យសម្ងាត់ ៨ តួ"
              style={
                dimension === "sm"
                  ? LoginStyle.LoginScreenTextInputTextSM
                  : LoginStyle.LoginScreenTextInputText
              }
              onChangeText={(e) => setPassword(e)}
              keyboardType="default"
              secureTextEntry={eye}
            />
            <TouchableOpacity onPress={() => setEye(!eye)}>
              <Image
                source={
                  eye
                    ? require("../assets/Images/view.png")
                    : require("../assets/Images/hide.png")
                }
                style={
                  dimension === "sm"
                    ? LoginStyle.LoginScreenTextInputIconSM
                    : LoginStyle.LoginScreenTextInputIcon
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={LoginStyle.LoginScreenOptionContainer}>
          <View style={LoginStyle.LoginScreenOptionRememberPasswordContainer}>
            <Checkbox
              style={
                dimension === "sm"
                  ? LoginStyle.LoginScreenCheckboxSM
                  : LoginStyle.LoginScreenCheckbox
              }
              value={isChecked}
              // onValueChange={setChecked}
              color={isChecked ? "#3C6EFB" : undefined}
            />
            <TouchableOpacity onPress={() => {}}>
              <Text
                style={
                  dimension === "sm"
                    ? LoginStyle.LoginScreenText1SM
                    : LoginStyle.LoginScreenText1
                }
              >
                {/* រក្សាទុកពាក្យសម្ងាត់ */}
                Save me
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigate("/forgot-pass")}>
            <Text
              style={
                dimension === "sm"
                  ? LoginStyle.LoginScreenText1SM
                  : LoginStyle.LoginScreenText1
              }
            >
              {/* ភ្លេចពាក្យសម្ងាត់? */}
              Foget password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={
            dimension === "sm"
              ? LoginStyle.LoginScreenLoginButtonSM
              : LoginStyle.LoginScreenLoginButton
          }
          onPress={() => {
            handleLogin();
          }}
        >
          <Text
            style={
              dimension === "sm"
                ? LoginStyle.LoginScreenLoginButtonTextSM
                : LoginStyle.LoginScreenLoginButtonText
            }
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>

      {!isKeyboardVisible && (
        <View style={LoginStyle.LoginScreenFooterContainer}>
          <Image
            source={require("../assets/Images/bottomImage.png")}
            style={LoginStyle.LoginScreenFooterImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}
