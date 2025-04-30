import FurnitureListComponent from "./FurnitureListComponent";

import { Text, View } from "react-native";

const HouseListComponent = ({ houses, selected, setSelected, onFurnitureSelect }) => {

    return (
        <View>
            {houses.map((house) => (
                <View 
                    key={house.houseId}
                >
                    <View>
                        <Text> -- {house.houseName}</Text>
                        <FurnitureListComponent house={house} selected={selected} setSelected={setSelected} onFurnitureSelect={onFurnitureSelect}/>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default HouseListComponent;