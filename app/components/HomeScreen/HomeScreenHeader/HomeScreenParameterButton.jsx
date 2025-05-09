import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function HomeScreenParameterButton() {
    return (
        <View style={styles.headerSide}>
            <TouchableOpacity style={styles.circleButton}>
                <MaterialIcons name="settings" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerSide: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20
    },
});

export default HomeScreenParameterButton;