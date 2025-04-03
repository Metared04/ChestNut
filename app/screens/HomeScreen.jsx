import { useEffect, useState } from 'react';
import { fetchFoods, addFood, deleteFood } from '../services/foodService';

function HomeScreen() {
    const [foodList, setFoodList] = useState([]);

    useEffect(() => {
        loadFoods();
      }, []);
    
    const loadFoods = async () => {
        try {
            const data = await fetchFoods();
            setFoods(data);
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
        }
    };

    return (
    <View>
    <Button title="Ajouter une pomme" onPress={handleAddFood} />
    <FlatList 
      data={foods}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name} - {item.calories} kcal</Text>
        </View>
      )}
    />
  </View>
);
}

export default HomeScreen();