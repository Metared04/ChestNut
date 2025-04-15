import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function TemperatureSelector() {
  const [selectedOption, setSelectedOption] = useState(null);

  const fridgePosition = useRef(new Animated.Value(0)).current;
  const freezerPosition = useRef(new Animated.Value(0)).current;

  const fridgeOpacity = useRef(new Animated.Value(1)).current;
  const freezerOpacity = useRef(new Animated.Value(1)).current;

  const containerHeight = height * 0.4;
  const optionSize = 40;
  const touchAreaSize = 60;
  const paddingVertical = 10;
  const trackHeight = containerHeight - paddingVertical * 2;
  const topPosition = paddingVertical;
  const bottomPosition = containerHeight - paddingVertical - optionSize;

  useEffect(() => {
    fridgePosition.setValue(bottomPosition);
    freezerPosition.setValue(topPosition);
  }, []);

  const createPanResponder = (
    positionRef,
    otherOpacity,
    optionKey,
    otherKey,
    isFridge
  ) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        positionRef.extractOffset();
        if (selectedOption === otherKey) setSelectedOption(null);
      },
      onPanResponderMove: (_, gesture) => {
        const moveY = gesture.dy;
        const offset = positionRef._offset || 0;
        const newY = isFridge
          ? Math.min(bottomPosition, Math.max(topPosition, offset + moveY))
          : Math.max(topPosition, Math.min(bottomPosition, offset + moveY));

        positionRef.setValue(newY - offset);

        const percent = isFridge
          ? (bottomPosition - newY) / (bottomPosition - topPosition)
          : (newY - topPosition) / (bottomPosition - topPosition);

        if (percent > 0.5) {
          otherOpacity.setValue(1 - (percent - 0.5) * 2);
        } else {
          otherOpacity.setValue(1);
        }
      },
      onPanResponderRelease: () => {
        positionRef.flattenOffset();
        const currentY = positionRef._value;

        const threshold = trackHeight * 0.4;
        const condition = isFridge
          ? currentY < bottomPosition - threshold
          : currentY > topPosition + threshold;

        if (condition) {
          setSelectedOption(optionKey);
          Animated.spring(positionRef, {
            toValue: isFridge ? topPosition : bottomPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          Animated.timing(otherOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(positionRef, {
            toValue: isFridge ? bottomPosition : topPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          Animated.timing(otherOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
          if (selectedOption === optionKey) setSelectedOption(null);
        }
      },
    });

  const fridgePanResponder = useRef(
    createPanResponder(fridgePosition, freezerOpacity, 'fridge', 'freezer', true)
  ).current;

  const freezerPanResponder = useRef(
    createPanResponder(freezerPosition, fridgeOpacity, 'freezer', 'fridge', false)
  ).current;

  const resetSelection = () => {
    setSelectedOption(null);
    fridgeOpacity.setValue(1);
    freezerOpacity.setValue(1);
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(freezerPosition, {
          toValue: topPosition,
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }),
        Animated.spring(fridgePosition, {
          toValue: bottomPosition,
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }),
      ]).start();
    }, 50);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.controlContainer, { height: containerHeight }]}>
        <View style={styles.sliderTrack} />

        <Animated.View
          style={[
            styles.optionTouchArea,
            {
              top: freezerPosition,
              opacity: freezerOpacity,
              zIndex: selectedOption === 'freezer' ? 2 : 1,
            },
          ]}
          {...freezerPanResponder.panHandlers}
        >
          <View
            style={[
              styles.option,
              {
                backgroundColor:
                  selectedOption === 'freezer' ? '#e0f7fa' : 'white',
                borderWidth: selectedOption === 'freezer' ? 3 : 1,
                borderColor:
                  selectedOption === 'freezer' ? '#4fc3f7' : '#ddd',
              },
            ]}
          >
            <MaterialCommunityIcons
              name="snowflake"
              size={18}
              color={selectedOption === 'freezer' ? '#0277bd' : '#555'}
            />
            <Text
              style={[
                styles.optionText,
                selectedOption === 'freezer' && styles.selectedText,
              ]}
            >
              Freezer
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.optionTouchArea,
            {
              top: fridgePosition,
              opacity: fridgeOpacity,
              zIndex: selectedOption === 'fridge' ? 2 : 1,
            },
          ]}
          {...fridgePanResponder.panHandlers}
        >
          <View
            style={[
              styles.option,
              {
                backgroundColor:
                  selectedOption === 'fridge' ? '#e0f7fa' : 'white',
                borderWidth: selectedOption === 'fridge' ? 3 : 1,
                borderColor: selectedOption === 'fridge' ? '#4fc3f7' : '#ddd',
              },
            ]}
          >
            <Text
              style={[
                styles.questionMark,
                selectedOption === 'fridge' && styles.selectedText,
              ]}
            >
              ?
            </Text>
            <Text
              style={[
                styles.optionText,
                selectedOption === 'fridge' && styles.selectedText,
              ]}
            >
              Fridge
            </Text>
          </View>
        </Animated.View>
      </View>

      <Text style={styles.instructionText}>
        {selectedOption
          ? `${
              selectedOption === 'fridge' ? 'Réfrigérateur' : 'Congélateur'
            } sélectionné`
          : "Glissez une option jusqu'au bout"}
      </Text>

      {selectedOption && (
        <Text style={styles.resetButton} onPress={resetSelection}>
          Réinitialiser
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  controlContainer: {
    width: 70,
    backgroundColor: 'transparent',
    borderRadius: 35,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sliderTrack: {
    position: 'absolute',
    width: 2,
    height: '80%',
    backgroundColor: '#ccc',
    borderRadius: 1,
  },
  optionTouchArea: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    left: 5,
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 10,
    color: '#555',
    marginTop: 2,
  },
  questionMark: {
    fontSize: 14,
    color: '#555',
    marginBottom: 1,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#0277bd',
  },
  instructionText: {
    marginTop: 10,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 8,
    padding: 5,
    color: '#0277bd',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
