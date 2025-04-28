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

// Récupération des dimensions de l'écran
const { height, width } = Dimensions.get('window');

export default function TemperatureSelector() {
  // État pour suivre l'option sélectionnée (fridge ou freezer)
  const [selectedOption, setSelectedOption] = useState(null);

  // Animations pour les positions des cercles
  const fridgePosition = useRef(new Animated.Value(0)).current;
  const freezerPosition = useRef(new Animated.Value(0)).current;

  // Animations pour l'opacité des cercles
  const fridgeOpacity = useRef(new Animated.Value(1)).current;
  const freezerOpacity = useRef(new Animated.Value(1)).current;

  // Dimensions du composant
  const containerHeight = height * 0.4; // Hauteur du slider
  const optionSize = 70; // Taille des cercles
  const touchAreaSize = 80; // Zone tactile légèrement plus grande que les cercles
  const paddingVertical = 30; // Espacement vertical pour garder les cercles dans le slider
  const trackHeight = containerHeight - paddingVertical * 2; // Hauteur de la zone de déplacement
  const topPosition = paddingVertical; // Position du cercle supérieur
  const bottomPosition = containerHeight - paddingVertical - optionSize; // Position du cercle inférieur

  // Initialisation des positions au chargement
  useEffect(() => {
    // Fridge en haut, Freezer en bas
    fridgePosition.setValue(topPosition);
    freezerPosition.setValue(bottomPosition);
  }, []);

  // Création des gestionnaires de mouvement tactile
  const createPanResponder = (
    positionRef, // Référence à l'animation de position
    otherOpacity, // Référence à l'opacité de l'autre cercle
    optionKey, // Clé de l'option (fridge ou freezer)
    otherKey, // Clé de l'autre option
    isFridge // Boolean pour distinguer le frigo du congélateur
  ) =>
    PanResponder.create({
      // Active le pan responder au toucher
      onStartShouldSetPanResponder: () => true,
      
      // Au début du mouvement
      onPanResponderGrant: () => {
        positionRef.extractOffset();
        if (selectedOption === otherKey) setSelectedOption(null);
      },
      
      // Pendant le mouvement
      onPanResponderMove: (_, gesture) => {
        const moveY = gesture.dy;
        const offset = positionRef._offset || 0;
        
        // Limites de mouvement selon qu'il s'agit du frigo ou du congélateur
        const newY = isFridge
          ? Math.min(bottomPosition, Math.max(topPosition, offset + moveY))
          : Math.max(topPosition, Math.min(bottomPosition, offset + moveY));

        positionRef.setValue(newY - offset);

        // Calcul de l'opacité de l'autre option en fonction de la position
        const percent = isFridge
          ? (bottomPosition - newY) / (bottomPosition - topPosition)
          : (newY - topPosition) / (bottomPosition - topPosition);

        if (percent > 0.5) {
          otherOpacity.setValue(1 - (percent - 0.5) * 2);
        } else {
          otherOpacity.setValue(1);
        }
      },
      
      // À la fin du mouvement
      onPanResponderRelease: () => {
        positionRef.flattenOffset();
        const currentY = positionRef._value;

        // Seuil pour considérer que l'option est sélectionnée
        const threshold = trackHeight * 0.4;
        const condition = isFridge
          ? currentY > topPosition + threshold
          : currentY < bottomPosition - threshold;

        if (condition) {
          // Sélection de l'option
          setSelectedOption(optionKey);
          
          // Animation de déplacement vers la position finale
          Animated.spring(positionRef, {
            toValue: isFridge ? bottomPosition : topPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          
          // Animation de disparition de l'autre option
          Animated.timing(otherOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          // Retour à la position initiale
          Animated.spring(positionRef, {
            toValue: isFridge ? topPosition : bottomPosition,
            useNativeDriver: false,
            friction: 7,
          }).start();
          
          // Restauration de l'opacité de l'autre option
          Animated.timing(otherOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
          
          // Désélection si l'option était sélectionnée
          if (selectedOption === optionKey) setSelectedOption(null);
        }
      },
    });

  // Création des gestionnaires de mouvement pour chaque cercle
  const fridgePanResponder = useRef(
    createPanResponder(fridgePosition, freezerOpacity, 'fridge', 'freezer', true)
  ).current;

  const freezerPanResponder = useRef(
    createPanResponder(freezerPosition, fridgeOpacity, 'freezer', 'fridge', false)
  ).current;

  // Fonction pour réinitialiser la sélection
  const resetSelection = () => {
    setSelectedOption(null);
    fridgeOpacity.setValue(1);
    freezerOpacity.setValue(1);
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(freezerPosition, {
          toValue: bottomPosition,
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }),
        Animated.spring(fridgePosition, {
          toValue: topPosition,
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }),
      ]).start();
    }, 50);
  };

  // Positions des groupes de flèches
  const upperArrowsPosition = containerHeight * 0.33 - 20; // Tiers supérieur pour les flèches vers le bas
  const lowerArrowsPosition = containerHeight * 0.66 - 20; // Tiers inférieur pour les flèches vers le haut

  return (
    <View style={styles.container}>
      <View style={[styles.controlContainer, { height: containerHeight }]}>
        {/* Ligne centrale invisible */}
        <View style={styles.sliderTrack} />
        
        {/* Flèches vers le bas (partie supérieure) */}
        <View style={[styles.arrowContainer, { top: upperArrowsPosition }]}>
          <MaterialCommunityIcons 
            name="chevron-down" 
            size={20} 
            color="#bdbdbd" 
            style={styles.arrowIcon} 
          />
          <MaterialCommunityIcons 
            name="chevron-down" 
            size={20} 
            color="#bdbdbd" 
            style={styles.arrowIcon} 
          />
        </View>
        
        {/* Flèches vers le haut (partie inférieure) */}
        <View style={[styles.arrowContainer, { top: lowerArrowsPosition }]}>
          <MaterialCommunityIcons 
            name="chevron-up" 
            size={20} 
            color="#bdbdbd" 
            style={styles.arrowIcon} 
          />
          <MaterialCommunityIcons 
            name="chevron-up" 
            size={20} 
            color="#bdbdbd" 
            style={styles.arrowIcon} 
          />
        </View>

        {/* Cercle du Frigo */}
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
                  selectedOption === 'fridge' ? '#f0f8ff' : 'white',
                borderWidth: selectedOption === 'fridge' ? 3 : 1,
                borderColor: selectedOption === 'fridge' ? '#e8f5fe' : '#e8f5fe',
              },
            ]}
          >
            <MaterialCommunityIcons
              name="fridge"
              size={22}
              color={selectedOption === 'fridge' ? '#555' : '#555'}
            />
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

        {/* Cercle du Congélateur */}
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
                  selectedOption === 'freezer' ? '#f0f8ff' : 'white',
                borderWidth: selectedOption === 'freezer' ? 3 : 1,
                borderColor:
                  selectedOption === 'freezer' ? '#e8f5fe' : '#e8f5fe',
              },
            ]}
          >
            <MaterialCommunityIcons
              name="snowflake"
              size={22}
              color={selectedOption === 'freezer' ? '#555' : '#555'}
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
      </View>

      {/* Texte d'instruction en bas */}
      <Text style={styles.instructionText}>
        {selectedOption
          ? `${
              selectedOption === 'fridge' ? 'Réfrigérateur' : 'Congélateur'
            } sélectionné`
          : "Glissez une option jusqu'au bout"}
      </Text>

      {/* Bouton de réinitialisation */}
      {selectedOption && (
        <Text style={styles.resetButton} onPress={resetSelection}>
          Réinitialiser
        </Text>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Conteneur principal
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  
  // Conteneur du slider
  controlContainer: {
    width: 120, // Largeur augmentée pour correspondre à l'image
    backgroundColor: '#f8faff', // Bleu très clair comme fond
    borderRadius: 60, // Bordure arrondie (moitié de la largeur)
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
    borderColor: '#edf2f7', // Bordure légèrement visible
  },
  
  // Ligne centrale (invisible)
  sliderTrack: {
    position: 'absolute',
    width: 2,
    height: '70%',
    backgroundColor: 'transparent', // Transparent = invisible
    borderRadius: 1,
  },
  
  // Conteneur des flèches
  arrowContainer: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Style des icônes de flèche
  arrowIcon: {
    marginVertical: -5, // Rapproche les flèches
  },
  
  // Zone tactile des cercles (légèrement plus grande que les cercles)
  optionTouchArea: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    left: 20, // Centrage dans le slider
  },
  
  // Style des cercles
  option: {
    width: 90, // Taille des cercles
    height: 90,
    borderRadius: 45, // Moitié de la taille pour avoir un cercle parfait
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e8f5fe', // Bordure bleu très clair
  },
  
  // Texte dans les cercles
  optionText: {
    fontSize: 14, // Taille de texte légèrement augmentée
    color: '#555',
    marginTop: 2,
  },
  
  // Style supplémentaire pour le texte sélectionné
  selectedText: {
    fontWeight: 'bold',
    color: '#555',
  },
  
  // Texte d'instruction en bas
  instructionText: {
    marginTop: 10,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  
  // Bouton de réinitialisation
  resetButton: {
    marginTop: 8,
    padding: 5,
    color: '#4a90e2',
    fontWeight: 'bold',
    fontSize: 12,
  },
});