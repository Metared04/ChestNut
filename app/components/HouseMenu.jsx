import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import { FontAwesome } from '@expo/vector-icons';

const HouseMenu = ({ visible, onClose, groupedHouses }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
      }}>
        {Object.entries(groupedHouses).map(([groupName, houses]) => (
          <View key={groupName} style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>{groupName}</Text>
            {houses.map((house, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                }}
              >
                <FontAwesome
                  name={house.icon || 'home'}
                  size={22}
                  color="#8b5cf6"
                  style={{ marginRight: 15 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16 }}>{house.name}</Text>
                </View>
                <Text style={{ color: '#6b7280' }}>{house.countText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </Modal>
  );
};

// export default HouseMenu;