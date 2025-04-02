import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";

const items = [
  { id: 1, name: "Bolognese", daysLeft: 1, icon: "🍝" },
  { id: 2, name: "Fresh Cream", daysLeft: 1, icon: "🥛" },
  { id: 3, name: "Ground Beef", daysLeft: 3, icon: "🥩" },
  { id: 4, name: "Chicken", daysLeft: 3, icon: "🍗" },
];

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 40px 16px 0;
  align-items: center;
`;

const HeaderText = styled.Text`
  color: #6b7280;
  font-size: 18px;
  text-align: center;
`;

const UserName = styled.Text`
  color: black;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SubHeaderText = styled.Text`
  color: #4b5563;
  align-self: flex-start;
  margin-left: 20px;
  margin-top: 8px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
  margin-top: 16px;
`;

const ItemBox = styled.TouchableOpacity`
  width: 48%;
  height: 100px;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: ${({ selected }) => (selected ? '#6b46c1' : '#e5e7eb')};
  flex-direction: row;
  align-items: center;
`;

const ItemIcon = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;

const ItemName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ selected }) => (selected ? 'white' : '#6b7280')};
`;

const ToggleContainer = styled.View`
  width: 48px;
  height: 120px;
  background-color: #e5e7eb;
  border-radius: 24px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  padding: 4px;
  position: relative;
`;

const ToggleButton = styled(Animated.View)`
  width: 40px;
  height: 50%;
  background-color: white;
  border-radius: 20px;
  position: absolute;
  justify-content: center;
  align-items: center;
`;

const ToggleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ active }) => (active ? '#6b46c1' : '#6b7280')};
  text-align: center;
`;

export default function App() {
  const [selected, setSelected] = useState(1);
  const [isFridge, setIsFridge] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleFridgeFreezer = () => {
    Animated.timing(slideAnim, {
      toValue: isFridge ? 1 : 0, // 1 = Freezer (en bas), 0 = Fridge (en haut)
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFridge(!isFridge);
  };

  const animatedTop = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 60], // Position du slide en haut et en bas
  });

  return (
    <Container>
      <StatusBar style="dark" />
      <HeaderText>Welcome</HeaderText>
      <UserName>John Smith</UserName>
      <SubHeaderText>Don't let these go to waste.</SubHeaderText>

      <ItemContainer>
        {items.map((item) => (
          <ItemBox key={item.id} selected={item.id === selected} onPress={() => setSelected(item.id)}>
            <ItemIcon>{item.icon}</ItemIcon>
            <ItemName selected={item.id === selected}>{item.name}</ItemName>
          </ItemBox>
        ))}
      </ItemContainer>

      {/* Toggle Fridge/Freezer */}
      <ToggleContainer>
        <TouchableOpacity onPress={toggleFridgeFreezer} style={{ flex: 1, width: "100%" }}>
          <ToggleButton style={{ top: animatedTop }}>
            <ToggleText active={isFridge}>{isFridge ? "Fridge" : "Freezer"}</ToggleText>
          </ToggleButton>
        </TouchableOpacity>
      </ToggleContainer>
    </Container>
  );
}
