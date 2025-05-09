import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get('window');

const HomeScreenStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 10,
        width: '100%',
        zIndex: 101,  // Valeur plus élevée pour toujours être au-dessus du menu
        position: 'relative'
    },
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
    mainContent: {
        flex: 1,
        width: '100%'
    },
    wasteText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 15
    },
    noFoodText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777'
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        height: height * 0.8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        zIndex: 100
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        marginTop: 50 // Augmenté pour laisser de la place au header toujours visible
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});

//export default HomeScreenStyles;