import { Keyboard, TouchableOpacity } from "react-native";

export default function KeyboardDismissableArea() {
  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    />
  );
}
