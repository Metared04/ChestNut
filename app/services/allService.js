import supabase from './supabase';

const fetchFoods = async () => {
    const { data, error } = await supabase.from("food_table").select("*");
    if (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        return null;
    }
    
    return data;
};

const insertFood = async (food, idFurniture) => {
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
    return await supabase.from("food_table").insert([foodData]).single();
};

const updatedFoodState = async (foodId, isOpened) => {
    return await supabase.from("food_table").update({ food_is_opened: !isOpened }).eq("food_id", foodId);
};

const deleteFood = async (food_id) => {
    return await supabase.from("food_table").delete().eq("food_id", food_id);
};

const fetchUserHouses = async (userId) => {
    const { data, error } = await supabase
        .from('user_house_table')
        .select('*')
        .eq('user_house_owner_id', userId);
  
    if (error) {
        console.error('Erreur de récupération des maisons :', error);
        return [];
    }
  
    return data;
};

const getFurnitureByHouseId = async (houseId) => {
    const { data, error } = await supabase
        .from('all_user_furniture_table')
        .select('*')
        .eq('user_house_id', houseId);
  
    if (error) {
        console.error("Erreur récupération meubles :", error);
        return [];
    }

    return data;
};

const getAllFoodsByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('food_table')
        .select('*, all_user_furniture_table!inner(user_id)')
        .eq('all_user_furniture_table.user_id', userId);
  
    if (error) {
        console.error("Erreur récupération aliments utilisateur :", error);
        return [];
    }
  
    return data;
};

const getFoodsByFurnitureId = async (furnitureId) => {
    const { data, error } = await supabase
        .from('food_table')
        .select('*')
        .eq('food_furniture_stored_id', furnitureId);
  
    if (error) {
        console.error("Erreur récupération aliments meuble :", error);
        return [];
    }
  
    return data;
};

const fetchUserHousesWithFurniture = async (userId) => {
    const { data, error } = await supabase
        .from("user_house_table")
        .select(`
            user_house_id,
            user_house_name,
            user_house_owner_id,
            all_user_furniture_table (
                user_furniture_id,
                user_furniture_name,
                user_furniture_type_id,
                user_id,
                user_house_id
            )
        `)
        .eq("user_house_owner_id", userId);

    if (error) {
        console.error("Erreur fetchUserHousesWithFurniture :", error);
        return [];
    }

    return data;
}

const fetchUserHousesWithFurnitureAndFoods = async (userId) => {
    const { data, error } = await supabase
    .from('user_house_table')
    .select(`
        user_house_id,
        user_house_name,
        user_house_owner_id,
        all_user_furniture_table (
            user_furniture_id,
            user_furniture_name,
            user_furniture_type_id,
            user_id,
            user_house_id,
                food_table (
                food_id,
                food_name
            )
        )
    `)
    .eq('user_house_owner_id', userId);

    if (error) {
        console.error("Erreur dans la requete fetchUserHousesWithFurnitureAndFoods :", error);
        return [];
    }

    return data;
}

const fetchAllUsersData = async (userId) => {
    const { data, error } = await supabase
        .from('users_table')
        .select(`
            user_id,
            user_name,
            user_mail,
            user_is_premium,
            user_house_table (
                user_house_id,
                user_house_name,
                user_house_owner_id,
                all_user_furniture_table (
                    user_furniture_id,
                    user_furniture_name,
                    user_furniture_type_id,
                    food_table (
                        food_id,
                        food_name,
                        food_brand,
                        food_registered_date,
                        food_expiration_date,
                        food_bar_code,
                        food_qty,
                        food_furniture_stored_id
                    )
                )
            )
        `)
        .eq('user_id', userId);
  
    if (error) {
      console.error('Erreur lors de la récupération des données complètes utilisateur :', error);
      return null;
    }
  
    return data?.[0]; // On suppose que user_id est unique, donc on prend le premier élément
};

const fetchAllProductCategories = async (keyword) => {
    const { data, error } = await supabase
    .from('categories_product_table')
    .select('category_id')
    .ilike('category_name', `%${keyword}%`);

    if (error) {
        console.error('Erreur lors de la recherche de la bonne categorie : ', error);
        return null;
    }
    if(data.length === 0){
        return [];
    } else {
        return data?.[0];
    }
}

const filtrationCategories = async (id) => {
    const { data, error } = await supabase
    .from('product_duration_table')
    .select(`
        product_name,
        product_duration,
        product_category_id
        `)
    .eq('product_category_id', id);
    //.ilike('product_name', `%${keyword}%`);
    
    if(error){
        console.log("Erreur lors de la recuperation de la duree : ", error);
    }
    return data;
}

export default {
    fetchFoods,
    updatedFoodState,
    deleteFood,
    fetchUserHouses,
    getFurnitureByHouseId,
    getAllFoodsByUserId,
    getFoodsByFurnitureId,
    fetchAllUsersData,
    fetchUserHousesWithFurniture,
    fetchUserHousesWithFurnitureAndFoods,
    insertFood,
    fetchAllProductCategories,
    filtrationCategories,
};