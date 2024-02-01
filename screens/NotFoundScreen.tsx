import { useTranslation } from "react-multi-lang";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  const t = useTranslation();
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
        {t("Oop!, Screen not found")}
      </Text>
    </View>
  );
}
