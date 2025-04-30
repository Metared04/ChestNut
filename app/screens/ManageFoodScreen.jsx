import { View } from "react-native";

import PreviousScreenButton from "../components/PreviousScreenBouton";
import AddFoodScreen from './AddFoodScreen';
import ScanBarCodeButton from "../components/ScanBarCodeButton";

function ManageFoodScreen() {
    return (
        <View style={{flex: 1}}>
            <PreviousScreenButton />
            <ScanBarCodeButton />
            <AddFoodScreen />
        </View>
  );
}

export default ManageFoodScreen;