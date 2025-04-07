import { View } from "react-native";

import FoodList from '../components/FoodList';
import AddFood from '../components/AddFood';

function ManageFoodScreen() {
    return (
    <View style={{flex: 1}}>
      <AddFood />
      <FoodList />
    </View>
  );
}

export default ManageFoodScreen;