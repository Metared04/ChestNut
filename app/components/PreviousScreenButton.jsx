import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

function PreviousScreenButton(){
    return (
    <TouchableOpacity >
        <Ionicons name="chevron-back" size={28} color="black" />
    </TouchableOpacity>
    );
}

export default PreviousScreenButton;