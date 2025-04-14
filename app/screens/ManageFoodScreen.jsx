import { View } from "react-native";

import FoodList from '../components/FoodList';
import AddFood from '../components/AddFood';
import ScanBarCode from "../components/ScanBarCode";

function ManageFoodScreen() {
    return (
    <View style={{flex: 1}}>
      <ScanBarCode />
      <AddFood />
      <FoodList />
    </View>
  );
}

export default ManageFoodScreen;