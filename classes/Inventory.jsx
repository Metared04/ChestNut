import Food from "./Food";

class Inventory
{
    constructor(inventoryMaxLength = 25, inventoryFoodList = [], inventoryType = new Set(["Frigo", "Congelateur"]))
    {
        this.inventoryMaxLength = inventoryMaxLength;
        this.inventoryFoodList = inventoryFoodList;
        this.inventoryType = inventoryType;
    }

    addFood(food) {
        if (!(food instanceof Food)){
            return "Objet pas de classe food"
        }
        if (this.inventoryFoodList.length < this.inventoryMaxLength) {
            this.inventoryFoodList.push(food);
            return food.foodName, "ajouté à l'inventaire.";
        } else {
            return "L'inventaire est plein !";
        }
    }
}

export default Inventory