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
import { moderateScale } from "../ Metrics";
import moment from "moment";

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
      setLoad(false);
    }, 500);
  }, []);

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

  const [validateEmailStatus, setValidateEmailStatus] = useState(false);

  const handleCheckValidate = (text: string) => {
    let reg: any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      // console.log("Email is Not Correct");
      setValidateEmailStatus(true);
      setEmail(text);
      return false;
    } else {
      setEmail(text);
      setValidateEmailStatus(false);
      // console.log("Email is Correct");
    }
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
        handleCheckValidate(userGmail);
      }
      if (userPassword) {
        setPassword(userPassword);
      }
    }
    getAccount();
  }, []);

  if (load) {
    return <ActivityIndicator />;
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
          <View style={LoginStyle.LoginScreenLogonImageContainer}>
            <Image
              source={require("../assets/logo.png")}
              resizeMode="contain"
              style={[
                LoginStyle.LoginScreenLoginStyle,
                {
                  height: moderateScale(130),
                  width: moderateScale(130),
                  borderRadius: 100,
                  borderWidth: moderateScale(2),
                },
              ]}
            />
          </View>

          <Text
            style={[
              LoginStyle.LoginScreenTitle1,
              { fontSize: moderateScale(20) },
            ]}
          >
            {/* សូមស្វាគមន៍!! */}
            Welcome Back!
          </Text>
          <Text
            style={[
              LoginStyle.LoginScreenTitle2,
              { fontSize: moderateScale(18) },
            ]}
          >
            {/* ប្រព័ន្ធការគ្រប់គ្រងកម្មវិធីសាលាហ្គោឡូប៊ល់ */}
            Leap Angkor Human Resource
          </Text>
        </View>
      )}
      <View
        style={
          isKeyboardVisible
            ? [
                LoginStyle.LoginScreenMidContainerKB,
                { marginTop: moderateScale(30) },
              ]
            : LoginStyle.LoginScreenMidContainer
        }
      >
        <View
          style={[
            LoginStyle.LoginScreenTextInputContainer,
            { marginTop: moderateScale(8) },
          ]}
        >
          <Text
            style={[
              LoginStyle.LoginScreenTextInputText,
              { fontSize: moderateScale(13) },
            ]}
          >
            {/* អ៉ីម៉ែល* */}
            Email*
          </Text>
          <View
            style={[
              LoginStyle.LoginScreenTextInputBox,
              {
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
                marginTop: moderateScale(5),
              },
            ]}
          >
            <TextInput
              value={email}
              placeholder="mail@gmail.com"
              style={[
                LoginStyle.LoginScreenTextInputText,
                { fontSize: moderateScale(14) },
              ]}
              onChangeText={(e) => {
                const updatedText = e.replace(/\s/g, "");
                handleCheckValidate(updatedText);
              }}
              keyboardType="email-address"
            />
          </View>

          {validateEmailStatus === true ? (
            <Text
              style={[
                LoginStyle.LoginRequireScreenTextInputText,
                { fontSize: moderateScale(12) },
              ]}
            >
              Oop!, invalid email
            </Text>
          ) : null}

          {/* {email === "" ? (
            <Text
              style={[
                LoginStyle.LoginRequireScreenTextInputText,
                { fontSize: moderateScale(12) },
              ]}
            >
              Required!
            </Text>
          ) : email.indexOf(" ") !== -1 ? (
            <Text
              style={[
                LoginStyle.LoginRequireScreenTextInputText,
                { fontSize: moderateScale(12) },
              ]}
            >
              Invalid email!, email cannot contain spaces
            </Text>
          ) : validEmail ? null : (
            <Text
              style={[
                LoginStyle.LoginRequireScreenTextInputText,
                { fontSize: moderateScale(12) },
              ]}
            >
              Oop!, invalid email
            </Text>
          )} */}
        </View>
        <View
          style={[
            LoginStyle.LoginScreenTextInputContainer,
            { marginTop: moderateScale(8) },
          ]}
        >
          <Text
            style={[
              LoginStyle.LoginScreenTextInputText,
              { fontSize: moderateScale(13) },
            ]}
          >
            {/* ពាក្យសម្ងាត់* */}
            Password*
          </Text>
          <View
            style={[
              LoginStyle.LoginScreenTextInputBox,
              {
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
                marginTop: moderateScale(5),
              },
            ]}
          >
            <TextInput
              value={password}
              autoCorrect={true}
              placeholder="password"
              style={[
                LoginStyle.LoginScreenTextInputText,
                { fontSize: moderateScale(14) },
              ]}
              onChangeText={(e) => {
                const updatedText = e.replace(/\s/g, "");
                setPassword(updatedText);
              }}
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
                style={{ height: moderateScale(20), width: moderateScale(20) }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            LoginStyle.LoginScreenOptionContainer,
            { marginVertical: moderateScale(10) },
          ]}
        >
          <View style={LoginStyle.LoginScreenOptionRememberPasswordContainer}>
            <Checkbox
              style={[
                {
                  height: moderateScale(20),
                  width: moderateScale(20),
                  marginRight: moderateScale(8),
                },
              ]}
              value={isChecked}
              // onValueChange={setChecked}
              color={isChecked ? "#3C6EFB" : undefined}
            />
            <TouchableOpacity onPress={() => {}}>
              <Text
                style={[
                  LoginStyle.LoginScreenText1,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {/* រក្សាទុកពាក្យសម្ងាត់ */}
                Save me
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigate("/forgot-pass")}>
            <Text
              style={[
                LoginStyle.LoginScreenText2,
                { fontSize: moderateScale(14) },
              ]}
            >
              {/* ភ្លេចពាក្យសម្ងាត់? */}
              Forget password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            LoginStyle.LoginScreenLoginButton,
            {
              borderRadius: moderateScale(10),
              padding: moderateScale(10),
              marginTop: moderateScale(10),
            },
          ]}
          onPress={() => {
            handleLogin();
          }}
        >
          <Text
            style={[
              LoginStyle.LoginScreenLoginButtonText,
              { fontSize: moderateScale(14) },
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>

      {!isKeyboardVisible && (
        <View style={LoginStyle.LoginScreenFooterContainer}>
          <Text
            style={[
              LoginStyle.LoginScreenText1,
              { fontSize: moderateScale(14) },
            ]}
          >
            © {moment(new Date()).format("YYYY")} Leap Angkor.
          </Text>
        </View>
      )}
    </View>
  );
}
