import React from "react";
import styled from "styled-components/native";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const MenuButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f2f2f2;
  align-items: center;
  justify-content: center;
`;

const WelcomeContainer = styled.View`
  align-items: center;
`;

const HeaderText = styled.Text`
  color: #888;
  font-size: 16px;
  text-align: center;
`;

const UserName = styled.Text`
  color: black;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SettingsButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f2f2f2;
  align-items: center;
  justify-content: center;
`;

const SubHeaderText = styled.Text`
  color: #4b5563;
  align-self: flex-start;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const Header = () => (
  <>
    <HeaderContainer>
      <MenuButton>
        <FontAwesome name="bars" size={20} color="black" />
      </MenuButton>
      
      <WelcomeContainer>
        <HeaderText>Welcome</HeaderText>
        <UserName>John Smith</UserName>
      </WelcomeContainer>
      
      <SettingsButton>
        <FontAwesome name="cog" size={20} color="black" />
      </SettingsButton>
    </HeaderContainer>
    
    <SubHeaderText>Don't let these go to waste.</SubHeaderText>
  </>
);

export default Header;