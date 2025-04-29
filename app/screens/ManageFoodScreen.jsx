import { View, TouchableOpacity } from "react-native";

import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import AddFoodScreen from './AddFoodScreen';
import ScanBarCodeButton from "../components/ScanBarCodeButton";

function ManageFoodScreen() {
    return (
        <View style={{flex: 1}}>
            <TouchableOpacity >
                <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>
            <ScanBarCodeButton />
            <AddFoodScreen />
        </View>
  );
}

export default ManageFoodScreen;