import { View } from "react-native";

import AddFoodScreen from './AddFoodScreen';
import ScanBarCodeButton from "../components/ScanBarCodeButton";

function ManageFoodScreen() {
    return (
    <View style={{flex: 1}}>
      <ScanBarCodeButton />
      <AddFoodScreen />
    </View>
  );
}

export default ManageFoodScreen;