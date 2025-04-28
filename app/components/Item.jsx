import React from "react";
import styled from "styled-components/native";
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, Alert } from "react-native";
import supabase from '../services/supabase';

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

const getFoodIcon = (foodName) => {
  // Vérification que foodName est une chaîne de caractères valide
  const name = foodName ? foodName.toLowerCase() : '';
  
  if (name.includes('bolognese') || name.includes('sauce')) return 'cutlery';
  if (name.includes('cream') || name.includes('crème')) return 'glass';
  if (name.includes('beef') || name.includes('boeuf')) return 'cutlery';
  if (name.includes('chicken') || name.includes('poulet')) return 'drumstick-bite';
  return 'shopping-basket';
};

const ItemList = ({ items, selected, setSelected, onDelete }) => {

  const handleDelete = (id) => {
    console.log("Attempting to delete food with id:", id); // Debugging line
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cet aliment?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => {
            if (typeof onDelete === 'function') {
              console.log("Deleting food with id:", id); // Debugging line
              onDelete(id); // Call onDelete
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
      {items.map((item) => {
        console.log("Rendering item:", item); // Debugging line
        return (
          <ItemBox 
            key={item.food_id} 
            selected={item.food_id === selected} 
            onPress={() => setSelected(item.food_id)}
          >
            <ItemContent>
              <FontAwesome 
                name={getFoodIcon(item.foodName)} 
                size={24} 
                color={item.food_id === selected ? "white" : "#888"} 
              />
              <ItemName selected={item.food_id === selected}>
                {item.foodName.length > 25 
                  ? item.foodName.slice(0, 25) + '...' 
                  : item.foodName}
              </ItemName>
              <DaysLeft selected={item.food_id === selected}>
                {item.getNumberOfValidityDays() < 0 ? 0 : item.getNumberOfValidityDays()} jour(s)
              </DaysLeft>
            </ItemContent>

            {item.food_id === selected && (
              <>

                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
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
        );
      })}
    </ItemContainer>
  );
};

export default ItemList;
