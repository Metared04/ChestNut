import { View, Text, StyleSheet } from "react-native";

function HomeScreenTitleContainer({userNick}) {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.welcomeText}>Bienvenue</Text>
            <Text style={styles.nameText}>{userNick}</Text>
        </View>
    );
}

export default HomeScreenTitleContainer;

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
        flex: 1
    },
    welcomeText: {
        color: '#777',
        fontSize: 14
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
});