import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Animated } from "react-native";
import Container from "./components/Container";
import Header from "./components/Header";
import ItemList from "./components/Item";
import Toggle from "./components/Toggle";

const items = [
  { id: 1, name: "Bolognese", daysLeft: 1, icon: "🍝" },
  { id: 2, name: "Fresh Cream", daysLeft: 1, icon: "🥛" },
  { id: 3, name: "Ground Beef", daysLeft: 3, icon: "🥩" },
  { id: 4, name: "Chicken", daysLeft: 3, icon: "🍗" },
];

export default function App() {
  const [selected, setSelected] = useState(1);
  const [isFridge, setIsFridge] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleFridgeFreezer = () => {
    Animated.timing(slideAnim, {
      toValue: isFridge ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFridge(!isFridge);
  };

  return (
    <Container>
      <StatusBar style="dark" />
      <Header />
      <ItemList items={items} selected={selected} setSelected={setSelected} />
      <Toggle isFridge={isFridge} slideAnim={slideAnim} toggleFridgeFreezer={toggleFridgeFreezer} />
    </Container>
  );
}
