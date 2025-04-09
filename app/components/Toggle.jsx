import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Animated, 
  PanResponder,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function TemperatureSelector() {
  // States for tracking which option is selected
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Animation values
  const fridgePosition = useRef(new Animated.Value(0)).current;
  const freezerPosition = useRef(new Animated.Value(0)).current;
  
  // Opacity animations for appearing/disappearing
  const fridgeOpacity = useRef(new Animated.Value(1)).current;
  const freezerOpacity = useRef(new Animated.Value(1)).current;
  
  // Calculate container dimensions
  const containerHeight = height * 0.6;
  const optionSize = 80; // Reduced to ensure it doesn't overflow
  const trackHeight = containerHeight - optionSize;
  
  // Positions
  const topPosition = 0 + optionSize/2; // Adjusted to keep circle inside container
  const bottomPosition = trackHeight - optionSize/2; // Adjusted to keep circle inside container
  const centerPosition = trackHeight / 2;
  
  // Set initial positions on load
  useEffect(() => {
    fridgePosition.setValue(bottomPosition);
    freezerPosition.setValue(topPosition);
  }, []);
  
  // PanResponder for Fridge
  const fridgePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        fridgePosition.setOffset(fridgePosition._value);
        fridgePosition.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        let newPosition = Math.min(
          bottomPosition, 
          Math.max(topPosition, fridgePosition._offset + gesture.dy)
        );
        
        fridgePosition.setValue(newPosition - fridgePosition._offset);
        
        // As fridge moves up, make freezer fade out
        const distanceFromBottom = bottomPosition - newPosition;
        const percentMoved = distanceFromBottom / (bottomPosition - topPosition);
        
        // Start fading out freezer after fridge passes halfway point
        if (percentMoved > 0.5) {
          const fadeAmount = 1 - ((percentMoved - 0.5) * 2); // Scale from 1 to 0 in second half
          freezerOpacity.setValue(Math.max(0, fadeAmount));
        } else {
          freezerOpacity.setValue(1);
        }
      },
      onPanResponderRelease: () => {
        fridgePosition.flattenOffset();
        
        // If fridge is moved significantly up (past 40% of track)
        if (fridgePosition._value < bottomPosition - (trackHeight * 0.4)) {
          setSelectedOption('fridge');
          
          // Animate fridge to top position
          Animated.spring(fridgePosition, {
            toValue: topPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          
          // Hide freezer completely
          Animated.timing(freezerOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          // Reset to bottom position
          Animated.spring(fridgePosition, {
            toValue: bottomPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          
          // Show freezer again
          Animated.timing(freezerOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
          
          if (selectedOption === 'fridge') {
            setSelectedOption(null);
          }
        }
      }
    })
  ).current;
  
  // PanResponder for Freezer
  const freezerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        freezerPosition.setOffset(freezerPosition._value);
        freezerPosition.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        let newPosition = Math.max(
          topPosition, 
          Math.min(bottomPosition, freezerPosition._offset + gesture.dy)
        );
        
        freezerPosition.setValue(newPosition - freezerPosition._offset);
        
        // As freezer moves down, make fridge fade out
        const distanceFromTop = newPosition - topPosition;
        const percentMoved = distanceFromTop / (bottomPosition - topPosition);
        
        // Start fading out fridge after freezer passes halfway point
        if (percentMoved > 0.5) {
          const fadeAmount = 1 - ((percentMoved - 0.5) * 2); // Scale from 1 to 0 in second half
          fridgeOpacity.setValue(Math.max(0, fadeAmount));
        } else {
          fridgeOpacity.setValue(1);
        }
      },
      onPanResponderRelease: () => {
        freezerPosition.flattenOffset();
        
        // If freezer is moved significantly down (past 40% of track)
        if (freezerPosition._value > topPosition + (trackHeight * 0.4)) {
          setSelectedOption('freezer');
          
          // Animate freezer to bottom position
          Animated.spring(freezerPosition, {
            toValue: bottomPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          
          // Hide fridge completely
          Animated.timing(fridgeOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          // Reset to top position
          Animated.spring(freezerPosition, {
            toValue: topPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          
          // Show fridge again
          Animated.timing(fridgeOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
          
          if (selectedOption === 'freezer') {
            setSelectedOption(null);
          }
        }
      }
    })
  ).current;

  // Reset function when user wants to change selection
  const resetSelection = () => {
    setSelectedOption(null);
    
    // Reset positions with animation
    Animated.parallel([
      Animated.spring(freezerPosition, {
        toValue: topPosition,
        useNativeDriver: false,
        friction: 7,
      }),
      Animated.spring(fridgePosition, {
        toValue: bottomPosition,
        useNativeDriver: false,
        friction: 7,
      }),
      Animated.timing(freezerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(fridgeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.controlContainer, { height: containerHeight }]}>
        <View style={styles.sliderTrack} />
        
        {/* Freezer Option */}
        <Animated.View
          style={[
            styles.option,
            { 
              transform: [{ translateY: freezerPosition }],
              opacity: freezerOpacity,
              backgroundColor: selectedOption === 'freezer' ? '#e0f7fa' : 'white',
              borderWidth: selectedOption === 'freezer' ? 3 : 1,
              borderColor: selectedOption === 'freezer' ? '#4fc3f7' : '#ddd',
              zIndex: selectedOption === 'freezer' ? 2 : 1,
            }
          ]}
          {...freezerPanResponder.panHandlers}
        >
          <MaterialCommunityIcons name="snowflake" size={28} color={selectedOption === 'freezer' ? '#0277bd' : '#555'} />
          <Text style={[styles.optionText, selectedOption === 'freezer' && styles.selectedText]}>
            Freezer
          </Text>
        </Animated.View>
        
        {/* Fridge Option */}
        <Animated.View
          style={[
            styles.option,
            { 
              transform: [{ translateY: fridgePosition }],
              opacity: fridgeOpacity,
              backgroundColor: selectedOption === 'fridge' ? '#e0f7fa' : 'white',
              borderWidth: selectedOption === 'fridge' ? 3 : 1,
              borderColor: selectedOption === 'fridge' ? '#4fc3f7' : '#ddd',
              zIndex: selectedOption === 'fridge' ? 2 : 1,
            }
          ]}
          {...fridgePanResponder.panHandlers}
        >
          <Text style={[styles.questionMark, selectedOption === 'fridge' && styles.selectedText]}>?</Text>
          <Text style={[styles.optionText, selectedOption === 'fridge' && styles.selectedText]}>
            Fridge
          </Text>
        </Animated.View>
      </View>
      
      <Text style={styles.instructionText}>
        {selectedOption 
          ? `${selectedOption === 'fridge' ? 'Réfrigérateur' : 'Congélateur'} sélectionné` 
          : 'Glissez une option jusqu\'au bout'}
      </Text>
      
      {selectedOption && (
        <Text 
          style={styles.resetButton}
          onPress={resetSelection}
        >
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
    backgroundColor: '#f5f5f5',
  },
  controlContainer: {
    width: 120,
    backgroundColor: '#e9e9e9',
    borderRadius: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Ensure nothing goes outside the container
  },
  sliderTrack: {
    position: 'absolute',
    width: 4,
    height: '85%',
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  option: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
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
    left: 20, // (container width - option width) / 2
  },
  optionText: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  questionMark: {
    fontSize: 28,
    color: '#555',
    marginBottom: 2,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#0277bd',
  },
  instructionText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 15,
    padding: 10,
    color: '#0277bd',
    fontWeight: 'bold',
    fontSize: 16,
  }
});