import React from "react";
import styled from "styled-components/native";

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
  background-color: ${({ selected }) => (selected ? "#6b46c1" : "#e5e7eb")};
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
  color: ${({ selected }) => (selected ? "white" : "#6b7280")};
`;

const ItemList = ({ items, selected, setSelected }) => (
  <ItemContainer>
    {items.map((item) => (
      <ItemBox key={item.id} selected={item.id === selected} onPress={() => setSelected(item.id)}>
        <ItemIcon>{item.icon}</ItemIcon>
        <ItemName selected={item.id === selected}>{item.name}</ItemName>
      </ItemBox>
    ))}
  </ItemContainer>
);

export default ItemList;