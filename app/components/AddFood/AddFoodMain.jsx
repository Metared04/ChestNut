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

async function parcoursListe(liste) {
    try {
        var matchedCategory = [];
        for(let i = 0; i < liste.length; i++) {
            const getCategories = await allService.fetchAllProductCategories(liste[i].toLowerCase().normalize().trim());
             if (getCategories.length !== 0){
                matchedCategory.push(getCategories)
            };
        }
        return(matchedCategory);
    }
        catch(error){
            console.error("Erreur chargement  :", error);
        }
}

async function recupProduitsBDD(listeCategorie) {
    try {
        console.log("liste categorie : ", listeCategorie);
        var allMatchedCategories = [];
        for(let i= 0; i < listeCategorie.length; i++) {
            const getProducts = await allService.filtrationCategories(listeCategorie[i].category_id);
            if (getProducts.length !== 0){
                for(let i= 0; i < getProducts.length; i++){
                    allMatchedCategories.push(getProducts[i]);
                }
            };
        }
        return(allMatchedCategories);
    }
    catch(error){
        console.error("Erreur dans recupProduitsBDD :", error);
    }
}

function similaritéParMots(a, b) {
    const motsA = a.toLowerCase().trim().split(/\s+/);
    const motsB = b.toLowerCase().trim().split(/\s+/);

    let totalScore = 0;

    for (const motB of motsB) {
        let minScore = Infinity;
        for (const motA of motsA) {
            const score = levenshtein(motA, motB);
            minScore = Math.min(minScore, score);
        }

        // BONUS : si le mot est présent tel quel, réduis fortement le score
        if (motsA.includes(motB)) {
            minScore -= 2; // ou * 0.5, ou fixe à 0
        }

        totalScore += Math.max(minScore, 0); // évite score négatif
    }

    return totalScore;
}

function trouverNomLePlusSimilaire(reference, liste) {
    let meilleurNom = null;
    let meilleurScore = Infinity;

    for (const candidat of liste) {
        const score = similaritéParMots(reference, candidat.product_name);
        if (score < meilleurScore) {
            meilleurScore = score;
            meilleurNom = candidat;
        }
    }

    return meilleurNom;
}

function nettoyerNomProduit(nom) {
    return nom
      .toLowerCase()
      .normalize("NFD")                 // décompose les lettres accentuées (é → e + ́)
      .replace(/[\u0300-\u036f]/g, "") // supprime les marques d'accent
      .replace(/[^\w\s]/gi, '')        // retire les caractères spéciaux restants
      .replace(/\d+/g, '')             // retire les nombres
      .trim()
      .split(/\s+/);                   // découpe en mots
  }

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
        );
        }
    }
    return matrix[a.length][b.length];
}

function trouverCorrespondances(vraiNom, tabProduits) {
    if (tabProduits.length > 0) {
        var meilleurNom = tabProduits[0].product_name;
        var meilleurValLevenshtein = 100;

        for (let i = 0; i < tabProduits.length; i++){
            var nomActuel = tabProduits[i].product_name;
            var valeurLevenshteinActuel = levenshtein(vraiNom, nomActuel);

            if (meilleurValLevenshtein > valeurLevenshteinActuel) {
                meilleurValLevenshtein = valeurLevenshteinActuel;
                meilleurNom = nomActuel;
            }
        }
        return(meilleurNom);
    } 
}

/*function trouverCorrespondances(nomSaisi, tabBDD) {
    const motsSaisis = nomSaisi;
    const motBDD = tabBDD;
    //const tabBDD = extraireMotsBase(produitsBDD);
    console.log("mot bdd :",motBDD.tab);
    const correspondances = motsSaisis.map((mot) => {
        let meilleurMot = null;
        let meilleureDistance = Infinity;

        motBDD.forEach((index) => {
            console.log("mot a comparer : ", mot,"index = ", index);
            console.log("index.tab : ", index.tab);
        const dist = levenshtein(mot, index.keyword);
        console.log("dist : ", dist);
        if (dist < meilleureDistance) {
            meilleureDistance = dist;
            meilleurMot = index;
        }
        });

        return { mot, correspondance: meilleurMot };
    });
    console.log("correspondanse: ", correspondances);
    return correspondances;
}*/

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
                setProductNameData(data.trueProductName);
            const potentialCategories = await parcoursListe(data.allProductCategories);
            console.log(potentialCategories);
            const potentialProducts = await recupProduitsBDD(potentialCategories);
            console.log("=> ", potentialProducts);
            const nomCorrespondant = trouverCorrespondances(data.trueProductName, potentialProducts);
            console.log(nomCorrespondant);
            const testNom = trouverNomLePlusSimilaire(data.trueProductName, potentialProducts);
            console.log("code chatgpt : ", testNom);
                /*const nomNettoyer = nettoyerNomProduit(data.productRealName);
                console.log("resultat ",nomNettoyer);
                console.log(data.allProductCategories);
                setProductCategoriesData(data.allProductCategories);
                const kategories = await getItsCategory(data.allProductCategories);
                console.log(kategories);
                trouverCorrespondances(nomNettoyer, kategories);*/


                //ici comparer nom nettoyer et kategories
                //console.log(data.allProductCategories);
                //console.log(typeof(productCategoriesData));
                //console.log("===> ",(productCategoriesData));
                //setRecommandedDuration(getItsCategory(data.allProductCategories));
                //const resultat = getItsCategory(data.allProductCategories);
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
    const b = [];
    for(let i = 0; i < keywordsList.length; i++){
        const keyword = keywordsList[i].toLowerCase().trim();
        console.log("On va essayer avec :", keyword);
        const req = await allService.fetchAllProductCategories(keyword);
        console.log("resultat = ", req);
        //console.log("resultat id = ", typeof(req.category_id));
        if(req.length !== 0 ){
            //b.push({keyword, req});
            console.log("Test avec l'id n° ", req.category_id);
            const tab = await getDuration(req.category_id/*, keyword*/);
            const vraiTab = [];
            for(let i = 0; i < tab.length; i++){
                vraiTab.push(tab[i].product_name);
            }
            console.log("Le tab : ",tab)
            console.log("Le vrai tab : ",vraiTab)
            b.push({keyword, tab});
            return b;
        } else {
            console.log("Aucune data trouve.");
            //return [];
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
    console.log("b => ", b);
    return [];
}

async function getDuration(id){
    const res = await allService.filtrationCategories(id);
    console.log("un autre resultat : ", res);
    return res;
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