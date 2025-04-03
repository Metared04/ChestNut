import React from "react";
import { TouchableOpacity, Animated } from "react-native";
import styled from "styled-components/native";

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
  color: ${({ active }) => (active ? "#6b46c1" : "#6b7280")};
  text-align: center;
`;

const Toggle = ({ isFridge, slideAnim, toggleFridgeFreezer }) => {
  const animatedTop = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 60], // Position du slide en haut et en bas
  });

  return (
    <ToggleContainer>
      <TouchableOpacity onPress={toggleFridgeFreezer} style={{ flex: 1, width: "100%" }}>
        <ToggleButton style={{ top: animatedTop }}>
          <ToggleText active={isFridge}>{isFridge ? "Fridge" : "Freezer"}</ToggleText>
        </ToggleButton>
      </TouchableOpacity>
    </ToggleContainer>
  );
};

export default Toggle;