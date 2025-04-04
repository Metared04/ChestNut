import { View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { supabase } from '../services/supabase';

import { fetchFoods, addFood, deleteFood } from '../services/foodService';

import FoodList from '../components/FoodList';
import AddFood from '../components/AddFood';

import ItemList from '../components/Item';

import Inventory from '../models/Inventory';
import Food from '../models/Food';

// let a = new Food("Petit Beurre Pocket", "Belle France", "2025-04-01", null, "2025-10-01", "3258561020686", 1, true);
/// let b = new Food("Yop de wish", "Pâturage", "2025-04-17", null, "2025-04-19", "3250391693009", 1, true);
/// let c = new Food("Filet mignon", "", "2025-04-18", null, "2025-04-22", "", 2, false);

// const aFridge = new Inventory(3, [a,b,c]);

// const items = aFridge.inventoryFoodList;

// Celui qui va afficher les composants permettant de gerer les aliments

function ManageFoodScreen() {
    return (
    <View>
      <AddFood />
      <FoodList />
    </View>
  );
}

export default ManageFoodScreen;