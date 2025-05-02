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
                //console.log(typeof(productNameData));
                //console.log(typeof(productCategoriesData));
                //console.log("===> ",(productCategoriesData));
                setRecommandedDuration(getItsCategory(data.allProductCategories));
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
            return 7;
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
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
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
  saveButtonTouchable: {
    paddingVertical: 14,
    alignhouses: 'center',
    justifyContent: 'center',
  },
});


export default AddFoodMain;