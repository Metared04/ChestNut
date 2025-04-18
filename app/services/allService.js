import supabase from './supabase';

const fetchFoods = async () => {
    return await supabase.from("all_food_table").select("*");
};

const updatedFoodState = async (foodId, isOpened) => {
    return await supabase.from("all_food_table").update({ food_is_opened: !isOpened }).eq("food_id", foodId);
};

const deleteFood = async (food_id) => {
    return await supabase.from("all_food_table").delete().eq("food_id", food_id);
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
    //const user_data = await allService.fetchUserHouses(userId);
    //id_user = user_data[0].user_house_id;
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
        console.error("Erreur fetchUserHousesWithFurnitureAndFoods :", error);
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
};