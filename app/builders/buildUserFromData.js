import User from '../models/User';
import House from '../models/House';
import Furniture from '../models/Furniture';
import Food from '../models/Food';

const buildUserFromData = (dataUser) => {
    const user = new User(dataUser.user_id, dataUser.user_name, dataUser.user_mail, dataUser.user_is_premium);
    //console.log("classe user marche : ", user instanceof User);
    if (dataUser.user_house_table) {
        dataUser.user_house_table.forEach(houseData => {
            const house = new House(houseData.user_house_id, houseData.user_house_name, houseData.user_house_owner);
            //console.log("classe house marche : ", house instanceof House);
            if (houseData.all_user_furniture_table) {
                houseData.all_user_furniture_table.forEach(furnitureData => {
                    const furniture = new Furniture(
                        furnitureData.user_furniture_id,
                        furnitureData.user_furniture_name,
                        furnitureData.user_furniture_type_id,
                        furnitureData.user_house_id
                    );
                    //console.log("classe furniture marche : ", furniture instanceof Furniture);
                    if (furnitureData.food_table) {
                        //console.log("ici : ", furnitureData.food_table)
                        furnitureData.food_table.forEach(foodData => {
                            const food = new Food(
                                foodData.food_id,
                                foodData.food_name,
                                foodData.food_brand,
                                foodData.food_registered_date,
                                //foodData.food_category,
                                foodData.food_expiration_date,
                                foodData.food_bar_code,
                                foodData.food_qty,
                                //foodData.food_opened_date,
                                //foodData.food_is_opened,
                                foodData.food_furniture_stored_id
                            );
                            //console.log("classe food marche : ", food instanceof Food);
                            //console.log("Ajout de : ", food);
                            furniture.addFood(food);
                        });
                    }

                    house.addFurniture(furniture);
                });
            }

            user.addHouse(house);
        });
    }

    return user;
};

export default buildUserFromData;