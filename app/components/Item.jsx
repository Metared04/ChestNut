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
  width: 35%;
  height: 100px;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: ${({ selected }) => (selected ? "#6b46c1" : "#e5e7eb")};
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
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
      <ItemBox key={item.foodId} selected={item.foodId === selected} onPress={() => setSelected(item.foodId)}>
        <ItemIcon>{item.getFoodIcon()}</ItemIcon>
        <ItemName selected={item.id === selected}>{item.getFoodName()}</ItemName>
        <ItemName selected={item.id === selected}>{item.getNumberOfValidityDays() < 0 ? 0 : item.getNumberOfValidityDays()} jour(s)</ItemName>
      </ItemBox>
    ))}
  </ItemContainer>
);

export default ItemList;