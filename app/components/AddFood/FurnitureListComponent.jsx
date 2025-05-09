import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const FurnitureListComponent = ({house, selected, setSelected, onFurnitureSelect}) => {
    return (
        <View style={styles.radioGroup}>
            {house.getHouseFurnitureList().map((furniture) => (
                <View
                    key={furniture.furnitureId}
                    selected={furniture.furnitureId === selected} 
                    onPress={() => setSelected(furniture.furnitureId)}
                >
                    <TouchableOpacity 
                        onPress={() => {
                            onFurnitureSelect(furniture, house);
                            setSelected(furniture.furnitureId);
                        }} 
                        style={styles.radioButton}>
                            <View style={[styles.outerCircle, furniture.furnitureId && styles.selected]}>
                                {selected === furniture.furnitureId && <View style={styles.innerCircle} />}
                            </View>
                            <Text>{furniture.furnitureName}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

export default FurnitureListComponent;

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignhouses: 'center',
    gap: 8,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignhouses: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a855f7',
  },
  selected: {
    borderColor: '#a855f7',
  },
});