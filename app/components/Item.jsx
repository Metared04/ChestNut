import React from "react";
import styled from "styled-components/native";
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Alert } from "react-native";

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

const ItemList = ({ items, selected, setSelected, onDelete, getFoodIcon }) => {

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cet aliment ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => {
            if (typeof onDelete === 'function') {
              onDelete(id);
            } else {
              console.error("La fonction onDelete n'est pas définie");
              Alert.alert("Erreur", "Impossible de supprimer l'élément");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ItemContainer>
      {items.map((item) => (
        <ItemBox 
          key={item.food_id} 
          selected={item.food_id === selected} 
          onPress={() => setSelected(item.food_id)}
        >
          <ItemContent>
            <FontAwesome 
              name={item.getFoodIcon()} 
              size={24} 
              color={item.food_id === selected ? "white" : "#888"} 
            />
            <ItemName selected={item.food_id === selected}>
              {item.foodName.length > 25 
                ? item.foodName.slice(0, 25) + '...' 
                : item.foodName}
            </ItemName>
            <DaysLeft selected={item.food_id === selected}>
              {item.foodDayLeft() < 0 ? 0 : item.foodDayLeft()} jour(s)
            </DaysLeft>
          </ItemContent>

          {item.food_id === selected && (
            <>
              <CheckCircle>
                <FontAwesome name="check" size={16} color="white" />
              </CheckCircle>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 15,
                  left: 15,
                  backgroundColor: 'red',
                  padding: 6,
                  borderRadius: 16,
                }}
                onPress={() => handleDelete(item.food_id)}
              >
                <FontAwesome name="trash" size={16} color="white" />
              </TouchableOpacity>
            </>
          )}
        </ItemBox>
      ))}
    </ItemContainer>
  );
};

export default ItemList;