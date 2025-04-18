import React from "react";
import styled from "styled-components/native";
import { FontAwesome } from '@expo/vector-icons';
import Food from "../models/Food";

const ItemContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
  margin-top: 16px;
`;

const ItemBox = styled.TouchableOpacity`
  width: 48%;
  height: 120px;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: ${({ selected }) => (selected ? "#8c52ff" : "#f2f2f2")};
  position: relative;
`;

const ItemContent = styled.View`
  justify-content: center;
`;

const ItemName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ selected }) => (selected ? "white" : "#444")};
  margin-top: 8px;
`;

const DaysLeft = styled.Text`
  font-size: 14px;
  color: ${({ selected }) => (selected ? "white" : "#888")};
  margin-top: 4px;
`;

const CheckCircle = styled.View`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
`;

const ItemList = ({ items, selected, setSelected }) => (
  <ItemContainer>
    {items.map((item) => (
      <ItemBox 
        key={item.foodId} 
        selected={item.foodId === selected} 
        onPress={() => setSelected(item.foodId)}
      >
        <ItemContent>
          <FontAwesome 
            name={item.getFoodIcon()} 
            size={24} 
            color={item.foodId === selected ? "white" : "#888"} 
          />
          <ItemName selected={item.foodId === selected}>
            {item.foodName}
          </ItemName>
          <DaysLeft selected={item.foodId === selected}>
            {item.foodDayLeft() < 0 ? 0 : item.foodDayLeft()} jour(s)
          </DaysLeft>
        </ItemContent>
        
        {item.foodId === selected && (
          <CheckCircle>
            <FontAwesome name="check" size={16} color="white" />
          </CheckCircle>
        )}
      </ItemBox>
    ))}
  </ItemContainer>
);

export default ItemList;