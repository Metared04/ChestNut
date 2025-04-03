import React from "react";
import styled from "styled-components/native";

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

const Header = () => (
  <>
    <HeaderText>Welcome</HeaderText>
    <UserName>John Smith</UserName>
    <SubHeaderText>Don't let these go to waste.</SubHeaderText>
  </>
);

export default Header;