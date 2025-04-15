import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';

const AnimatedFlatList = Animated.FlatList;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedFoodList = ({ foodList }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
  
    return (
        <AnimatedFlatList
            data={foodList}
            keyExtractor={(item, index) => item.foodId?.toString() ?? index.toString()}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            renderItem={({ item, index }) => {
                const inputRange = [
                    -1,
                    0,
                    100 * index,
                    100 * (index + 2),
                ];
  
            const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0.7],
            });
  
            const opacity = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0],
            });
  
            return (
                <Animated.View style={[styles.item, { opacity, transform: [{ scale }] }]}>
                    <Text style={styles.text}>{item.foodName}</Text>
                    </Animated.View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        backgroundColor: "#fafafa",
        borderRadius: 12,
        elevation: 2,
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
    }
});
  
export default AnimatedFoodList;