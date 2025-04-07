import { supabase } from "./supabase";

const fetchFoods = async () => {
    return await supabase.from("fridge_table").select("*");
};

const updatedFoodState = async (foodId, isOpened) => {
    return await supabase.from("fridge_table").update({ food_is_opened: !isOpened }).eq("food_id", foodId);
};

const deleteFood = async (food_id) => {
    return await supabase.from("fridge_table").delete().eq("food_id", food_id);
};

export default { fetchFoods, updatedFoodState, deleteFood };