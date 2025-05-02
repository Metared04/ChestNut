import React, { useEffect, useState } from 'react';

import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button, ActivityIndicator, FlatList } from "react-native";

import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import HouseListComponent from './HouseListComponent';

import allService from "../services/allService";
import buildUserFromData from "../builders/buildUserFromData";

import supabase from '../services/supabase';
import DateComponent from './DateComponent';
import RecommandedDate from './RecommandedDate';

import Food from '../models/Food';
import Furniture from '../models/Furniture';
import House from '../models/House';
import User from '../models/User';

const AddFood = ({ userId = 1 }) => {
    const [food, setFood] = useState(new Food());
    const [selected, setSelected] = useState(null);

    const [getLastId, setGetLastId] = useState(Math.floor(Math.random() * (1500 - 500 + 1)) + 500)

    const [idHouse, setIdHouse] = useState(1);
    const [idFurniture, setIdFurniture] = useState(1);

    const [houses, setHouses] = useState(new House());
    const [houseListe, setHouseListe] = useState([]);
    const [resetDateInput, setResetDateInput] = useState(false);

    const [productNameData, setProductNameData] = useState(null);
    const [productCategoriesData, setProductCategoriesData] = useState(null);

    const [recommandedDuration, setRecommandedDuration] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (food.foodBarCode) {
                const data = await food.getOpenFoodFactsData();
                //const data = await food.extractKeywords();
                setProductNameData(data.productRealName);
                setProductCategoriesData(data.allProductCategories);
                console.log(typeof(productNameData));
                console.log(typeof(productCategoriesData));
                console.log("===> ",(productCategoriesData));
                setRecommandedDuration(getItsCategory(data.allProductCategories));
            }
        };
    
        fetchData();
    }, [food.foodBarCode]);

    const getTheLastFoodId = async () => {
        try {
            const foodsData = await allService.fetchFoods();
            //console.log("foods => ", foodsData);
            setGetLastId(foodsData.length + 1);
        } catch (error){
            console.error("Erreur chargement produits :", error);
        }
    }

    const fetchExpiringFoods = async () => {
            try {
                const rawData = await allService.fetchAllUsersData(userId);
                //console.log("donnee brut :", rawData.user_house_table);
                //console.log("donnee brut 2 :", rawData.user_name);
                const user = buildUserFromData(rawData);
                const allFoods = user.getAllFoods();
                const allFurnitures = user.getAllFurnitures();
                const allHouses = user.getHousesList();
                //console.log("les produits => ", allFoods.length);
                //console.log("les meubles => ", allFurnitures);
                //console.log("les maisons => ", allHouses);
                setHouseListe(allHouses)
            } catch (error) {
                console.error("Erreur chargement meubles :", error);
            }
        };
    
    useEffect(() => {
        fetchExpiringFoods();
        getTheLastFoodId();
    }, []);

    const handleChange = (key, value) => {
        setFood(prev => new Food(
            prev.foodId ? prev.foodId : getLastId,
            key === "foodName" ? value : prev.foodName,
            key === "foodBrand" ? value : prev.foodBrand,
            key === "foodRegisteredDate" ? value : prev.foodRegisteredDate,
            key === "foodExpirationDate" ? value : prev.foodExpirationDate,
            key === "foodBarCode" ? value : prev.foodBarCode,
            key === "foodQty" ? parseInt(value) : prev.foodQty,
            //key === "foodIsOpened" ? value : prev.foodIsOpened,
            key === "foodFurnitureStoredId" ? value : prev.foodFurnitureStoredId
        ));

        console.log("dans handle change : ", value);
    };

    const handleFurnitureSelect = (furniture, house) => {
      //console.log("Meuble sélectionné :", furniture.inventoryId, ", Maison correspondante :", house.houseId);
        setIdFurniture(furniture.inventoryId);
        setIdHouse(house.houseId);
    };

    const saveFood = async () => {
        const foodData = {
            food_id: food.foodId,
            food_name: food.foodName,
            food_brand: food.foodBrand,
            food_registered_date: new Date(),
            food_expiration_date: food.foodExpirationDate,
            food_bar_code: food.foodBarCode,
            food_qty: food.foodQty,
            food_furniture_stored_id: idFurniture,
        }
        const {data, error} = await supabase.from("food_table").insert([foodData]).single();
        if(error){
            //console.log("Probleme d'ajout : ", error);
        } else {
            console.log("Ajout réussi :", foodData);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.label}>Ajout d'un produit</Text>
            </View>
            <TextInput
                placeholder="Nom du produit"
                value={food.foodName}
                style={styles.input}
                onChangeText={(text) => handleChange("foodName", text)}
            />
            <TextInput
                placeholder="Marque"
                value={food.foodBrand}
                style={styles.input}
                onChangeText={(text) => handleChange("foodBrand", text)}
            />
            <Text style={styles.label}>Stocké où ?</Text>
            <HouseListComponent houses={houseListe} selected={selected} setSelected={setSelected} onFurnitureSelect={handleFurnitureSelect}/>
            <Text style={styles.label}>Date de peremption</Text>
            <Text> ici pour la date recommander : {recommandedDuration ? recommandedDuration : "jsaipo"} jour(s), ce qui donne : {getRecommandedDate(recommandedDuration) ? getRecommandedDate(recommandedDuration) : "po trouve"}</Text>
            <DateComponent
                onChange={(date) => handleChange("foodExpirationDate", date)}
                reset={resetDateInput}
            />
            <Text style={styles.label}>Code barre</Text>
            <TextInput
                placeholder="Code barre"
                style={styles.input}
                value={food.foodBarCode}
                onChangeText={(text) => handleChange("foodBarCode", text)}
                maxLength={15}
            />
            <Text>Quantité</Text>
            <TextInput
                placeholder="Quantité"
                keyboardType="numeric"
                style={styles.input}
                value={food.foodQty ? food.foodQty.toString() : ""}
                onChangeText={(text) => handleChange("foodQty", text)}
                maxLength={3}
            />
            <LinearGradient
                colors={['#8027d6', '#d17af9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
            >
                <TouchableOpacity onPress={saveFood} style={styles.saveButtonTouchable} activeOpacity={0.8}>
                    <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};


function getItsCategory(keywordsList){
    //console.log("je rentre !");
    for(let i = 0; i < keywordsList.length; i++){
        const keyword = keywordsList[i].toLowerCase().trim();
        //console.log(i, "-> On essaie : ", keyword)
        if(keyword in shelfLifeMap){
            console.log("oui ! ");
            return shelfLifeMap[keyword];
        } else {
          console.log("rate !");
        }
    }
}

function getDateInMiliseconde(numberOfDays){
    if(numberOfDays === 0){
        return 86400000;
    }
    return numberOfDays * 86400000;
}

function getRecommandedDate(number){
    return (new Date(Date.now() + getDateInMiliseconde(number))).toISOString().split('T')[0];
}

const categoryMap = {
	"abats frais": "Viandes",
	"viande hachée du boucher": "Viandes",
	"saucisses": "Viandes",
	"viande cuite emballée": "Viandes",
	"fruits de mer": "Poissons et Fruits de mer",
	"poissons crus": "Poissons et Fruits de mer",
	"charcuterie": "Charcuteries",
	"bacon": "Charcuteries",
	"charcuterie tranchée": "Charcuteries",
	"charcuterie préemballée": "Charcuteries",
	"crème fraîche au lait cru": "Crèmes",
	"crème fraîche pasteurisée": "Crèmes",
	"fromage râpé": "Fromages",
	"fromage frais": "Fromages",
	"fromage à pâte dure": "Fromages",
  "laits": "Laits et Produits Laitiers Divers",
	"lait uht": "Laits et Produits Laitiers Divers",
	"laits uht": "Laits et Produits Laitiers Divers",
	"lait ultra-pasteurisé": "Laits et Produits Laitiers Divers",
	"beurre": "Laits et Produits Laitiers Divers",
	"oeufs frais": "Laits et Produits Laitiers Divers",
	"yaourt": "Produits Transformés à Base de Lait",
	"potage": "Soupe et Potage",
	"soupe": "Soupe et Potage",
	"sauce pour pâtes": "Sauces",
	"jus de fruit": "Jus de Fruits",
	"jus de fruit entamé": "Jus de Fruits",
	"raisins": "Fruits",
	"prunes": "Fruits",
	"pêche": "Fruits",
	"abricots": "Fruits",
	"pommes": "Fruits",
	"poivrons": "Fruits",
	"radis": "Fruits",
	"navet": "Fruits",
	"tomates": "Fruits",
	"courgettes": "Fruits",
	"concombre": "Fruits",
	"poireau": "Fruits",
	"carottes": "Légumes",
	"bettraves": "Légumes",
	"mayonnaise": "Condiments et Sauces",
	"ketchup": "Condiments et Sauces",
	"pommes de terre": "Épicerie",
};

const shelfLifeMap = {
  "abats frais": 1,
  "viande hachée du boucher": 1,
  "saucisses": 1,
  "fruits de mer": 1,
  "poissons crus": 1,
  "crême fraîche au lait cru": 2,
  "oeufs durs": 2,
  "viande cuite emballée": 2,
  "fruits rouge": 2,
  "yaourt": 3,
  "lait uht": 3,
  "laits uht": 3,
  "sauce pour pâtes": 3,
  "charcuterie": 3,
  "charcuteries": 3,
  "charcuterie tranchée": 3,
  "charcuterie préemballée": 3,
  "potage": 3,
  "soupe": 3,
  "crême fraîche pasteurisée": 4,
  "jus de fruit entamé": 5,
  "jus de fruit": 5,
  "raisins": 5,
  "prunes": 5,
  "lait ultra-pasteurisé": 7,
  "fromage rapé": 7,
  "fromage frais": 7,
  "pêche": 7,
  "abricots": 7,
  "poivrons": 7,
  "radis": 7,
  "navet": 7,
  "tomates": 7,
  "courgettes": 7,
  "concombre": 7,
  "poireau": 7,
  "beurre": 14,
  "frommage à pâte dure": 21,
  "oeufs frais": 21,
  "bettraves": 21,
  "mayonnaise": 60,
  "pommes": 60,
  "carottes": 90,
  "ketchup": 364,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
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
  selected: {
    borderColor: '#a855f7',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a855f7',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButtonGradient: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden', // pour que le bouton ne dépasse pas le gradient
  },
  
  saveButtonTouchable: {
    paddingVertical: 14,
    alignhouses: 'center',
    justifyContent: 'center',
  },
  
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default AddFood;

/*
            <Text style={styles.label}>Date de rangement</Text>
            <DateComponent
                onChange={(date) => handleChange("foodRegisteredDate", date)}
                reset={resetDateInput}
            />

            {house.foodId === selected && (
            <>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 15,
                  right: 15,
                  backgroundColor: 'red',
                  padding: 6,
                  borderRadius: 16,
                }}
                onPress={() => handleDelete(house.food_id)}
              >
                <FontAwesome name="trash" size={16} color="white" />
              </TouchableOpacity>
            </>
          )}

          <View style={[styles.outerCircle, food.foodFurnitureStoredId && styles.selected]}>
                          {food.foodFurnitureStoredId === 1 && <View style={styles.innerCircle} />}
                          
                      </View>

                      selected={house.houseId === selected} 
          onPress={() => setSelected(house.houseId)}

<View style={styles.radioGroup}>
                <TouchableOpacity onPress={() => handleChange("foodFurnitureStoredId", 1)} style={styles.radioButton}>
                    <View style={[styles.outerCircle, food.foodFurnitureStoredId && styles.selected]}>
                        {food.foodFurnitureStoredId === 1 && <View style={styles.innerCircle} />}
                    </View>
                <Text>Frigo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChange("foodFurnitureStoredId", 2)} style={styles.radioButton}>
                    <View style={[styles.outerCircle, !food.foodFurnitureStoredId && styles.selected]}>
                        {food.foodFurnitureStoredId === 2 && <View style={styles.innerCircle} />}
                    </View>
                    <Text>Congelo</Text>
                </TouchableOpacity>
            </View>
*/