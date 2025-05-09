import { TouchableOpacity, Text, StyleSheet } from "react-native";

function UseOpenFoodFactsComponent( {useOpenFoodsFactsApi} ) {
    return (
        <TouchableOpacity onPress={useOpenFoodsFactsApi} style={styles.saveButtonTouchable} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Verifier</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    saveButtonTouchable: {
        backgroundColor:'green',
        paddingVertical: 14,
        alignhouses: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default UseOpenFoodFactsComponent;