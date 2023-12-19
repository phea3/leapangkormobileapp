import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Kantumruy-Bold" }}>
        Oop!, Screen not found
      </Text>
    </View>
  );
}
