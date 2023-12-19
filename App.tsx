import { Platform, StatusBar } from "react-native";
import Router from "./Router";
import { NativeRouter as Routers } from "react-router-native";
import { useNavigate, useLocation } from "react-router-native";
import { MenuProvider } from "react-native-popup-menu";
import StyleProvider from "./styleProvider";
import { AuthProvider } from "./Context/AuthContext";
import ApolloConfig from "./Config/ApolloConfig";

export default function App() {
  return (
    <>
      <MenuProvider>
        <StyleProvider>
          <AuthProvider>
            <ApolloConfig>
              <Routers>
                <StatusBar
                  barStyle={
                    Platform.OS === "ios" ? "light-content" : "dark-content"
                  }
                />
                <Router />
              </Routers>
            </ApolloConfig>
          </AuthProvider>
        </StyleProvider>
      </MenuProvider>
    </>
  );
}
