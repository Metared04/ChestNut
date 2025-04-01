import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import styled from 'styled-components/native';

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
  height: 80px;
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
  width: 120px;
  height: 48px;
  background-color: #e5e7eb;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  padding: 4px;
  position: relative;
`;

const ToggleButton = styled(Animated.View)`
  width: ${({ isFridge }) => (isFridge ? '50%' : '50%')};
  height: 40px;
  background-color: white;
  border-radius: 20px;
  position: absolute;
  top: 4px;
`;

const ToggleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ active }) => (active ? '#6b46c1' : '#6b7280')};
  width: 50%;
  text-align: center;
`;

export default function App() {
  const [selected, setSelected] = useState(1);
  const [isFridge, setIsFridge] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleFridgeFreezer = () => {
    Animated.timing(slideAnim, {
      toValue: isFridge ? 60 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFridge(!isFridge);
  };

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
        <ToggleButton style={{ left: slideAnim }} />
        <TouchableOpacity onPress={toggleFridgeFreezer} style={{ width: '100%', alignItems: 'center' }}>
          <ToggleText active={isFridge}>Fridge</ToggleText>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFridgeFreezer} style={{ width: '100%', alignItems: 'center' }}>
          <ToggleText active={!isFridge}>Freezer</ToggleText>
        </TouchableOpacity>
      </ToggleContainer>
    </Container>
  );
}
