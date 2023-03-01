import { StyleSheet, Text } from "react-native";
import { Coordinate } from "../types/types";

export default function Food( {x, y}: Coordinate): JSX.Element {
  return <Text style={[{ top: y * 10, left: x * 10 }, style.food]}>🍎</Text>;
}

const style = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    borderRadius: 7,
    position: "absolute",
  }
})