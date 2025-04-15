import { View } from "react-native";

import FoodList from '../components/FoodList';
import AddFood from '../components/AddFood';
import ScanBarCodeButton from "../components/ScanBarCodeButton";

function ManageFoodScreen() {
    return (
    <View style={{flex: 1}}>
      <ScanBarCodeButton />
      <AddFood />
    </View>
  );
}

export default ManageFoodScreen;