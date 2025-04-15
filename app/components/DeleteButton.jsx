import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DeleteButton({ onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <MaterialCommunityIcons name="trash-can-outline" size={16} color="white" />
      <Text style={styles.text}>Supprimer</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 6,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
});
