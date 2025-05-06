import React, { useEffect, useState } from 'react';

import { Text, View, StyleSheet} from "react-native";

import allService from '../../services/allService';
import buildUserFromData from "../../builders/buildUserFromData";

import supabase from '../../services/supabase';

import Food from '../../models/Food';
import Furniture from '../../models/Furniture';
import House from '../../models/House';
import User from '../../models/User';

import FoodNameInput from './FoodNameInput';
import FoodBrandInput from './FoodBrandInput';
import HouseListComponent from './HouseListComponent';
import DateComponent from './DateComponent';
import FoodBarCodeInput from './FoodBarCodeInput';
import FoodQtyInput from './FoodQtyInput';
import FoodSaveInput from './FoodSaveInput';
import UseOpenFoodFactsComponent from './UseOpenFoodFactsComponent';

const AddFoodMain = ({ userId = 1 }) => {
    const [food, setFood] = useState(new Food());
    const [selected, setSelected] = useState(null);

    const [getLastId, setGetLastId] = useState(Math.floor(Math.random() * (1500 - 500 + 1)) + 500)

    const [idHouse, setIdHouse] = useState(1);
    const [idFurniture, setIdFurniture] = useState(1);

    //const [houses, setHouses] = useState(new House());
    const [houseListe, setHouseListe] = useState([]);
    const [resetDateInput, setResetDateInput] = useState(false);

    const [productNameData, setProductNameData] = useState(null);
    const [productCategoriesData, setProductCategoriesData] = useState(null);

    const [recommandedDuration, setRecommandedDuration] = useState(1);

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
            key === "foodFurnitureStoredId" ? value : prev.foodFurnitureStoredId
        ));

        console.log("dans handle change : ", value);
    };

    const handleFurnitureSelect = (furniture, house) => {
        setIdFurniture(furniture.inventoryId);
        setIdHouse(house.houseId);
    };

    const saveFood = async () => {
        console.log("oui ?")
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

    const useOpenFoodsFactsApi = async () => {
        console.log(food.foodBarCode);
        if (food.foodBarCode.length > 5) {
            console.log("On en a un, code barre existant ! ");
            const data = await food.getOpenFoodFactsData();
            if(data === null){
                console.log("??? Probleme juste la !");
            } else {
                setProductNameData(data.productRealName);
                setProductCategoriesData(data.allProductCategories);
                //console.log(data.allProductCategories);
                //console.log(typeof(productCategoriesData));
                //console.log("===> ",(productCategoriesData));
                //setRecommandedDuration(getItsCategory(data.allProductCategories));
                const resultat = getItsCategory(data.allProductCategories);
                // Faire une comparaison de resultat avec data.productRealName
            }
            //const data = await food.extractKeywords();
        } else {
            // Mettre un pop up pour dire que le code barre est pas correct
            console.log("c'est pas bon, code barre incomplet");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.label}>Ajout d'un produit</Text>
            </View>

            <FoodNameInput 
                value={food.foodName} 
                onChange={(text) => handleChange("foodName", text)} 
            />

            <FoodBrandInput 
                value={food.foodBrand} 
                onChange={(text) => handleChange("foodBrand", text)} 
            />

            <Text style={styles.label}>Stocké où ?</Text>

            <HouseListComponent 
                houses={houseListe} 
                selected={selected} 
                setSelected={setSelected} 
                onFurnitureSelect={handleFurnitureSelect}
            />

            <Text style={styles.label}>Date de peremption</Text>

            <Text> ici pour la date recommander : {recommandedDuration ? recommandedDuration : "jsaipo"} jour(s), ce qui donne : {getRecommandedDate(recommandedDuration) ? getRecommandedDate(recommandedDuration) : "po trouve"}</Text>
            
            <DateComponent
                onChange={(date) => handleChange("foodExpirationDate", date)}
                reset={resetDateInput}
            />
            <Text style={styles.label}>Code barre</Text>

            <FoodBarCodeInput
                value={food.foodBarCode}
                onChange={(text) => handleChange("foodBarCode", text)}
            />

            <UseOpenFoodFactsComponent useOpenFoodsFactsApi={useOpenFoodsFactsApi} />

            <Text>Quantité</Text>

            <FoodQtyInput
                value={food.foodQty.toString()}
                onChange={(text) => handleChange("foodQty", text)}
            />

            <FoodSaveInput saveFood={saveFood}/>
        </View>
    );
};


async function getItsCategory(keywordsList){
    //console.log("je rentre !");
    for(let i = 0; i < keywordsList.length; i++){
        const keyword = keywordsList[i].toLowerCase().trim();
        const req = await allService.fetchAllProductCategories(keyword);
        //console.log("resultat = ", req);
        //console.log("resultat id = ", typeof(req.category_id));
        if(req.length !== 0 ){
            console.log("Test : ", req.category_id);
            const tab = getDuration(req.category_id, keyword);
            //return tab;
        } else {
            console.log("Aucune data trouve.");
            return [];
        }
        /*
        if(keyword in shelfLifeMap){
            console.log("oui ! ");
            return shelfLifeMap[keyword];
        } else {
            console.log("rate !");
            return 7;
        }*/
    }
}

async function getDuration(id){
    const res = await allService.filtrationCategories(id);
    console.log("un autre resultat : ", res);
}

function getDateInMiliseconde(numberOfDays){
    if(numberOfDays === 0){
        return 86400000;
    }
    return numberOfDays * 86400000;
}

function getRecommandedDate(number){
    //return (new Date(Date.now() + getDateInMiliseconde(number))).toISOString().split('T')[0];
    return 14*86400000;
}


const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
});


export default AddFoodMain;