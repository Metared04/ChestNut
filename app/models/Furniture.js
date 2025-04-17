import Food from "./Food";

class Furniture {
	constructor(
		inventoryId = 1,
		inventoryName = "Frigo",
		inventoryNombreOfElement = 0,
		inventoryMaxLength = 25,
		inventoryFoodList = [],
		inventoryType = new Set(["Frigo", "Congelateur"])
	) {
		if (!inventoryName || inventoryName.trim() === "") {
			throw new Error("Le nom de l'inventaire ne peut pas être vide.");
		}

		if (!Number.isInteger(inventoryMaxLength) || inventoryMaxLength <= 0) {
			throw new Error("La capacité maximale doit être un entier positif.");
		}

		this.inventoryId = inventoryId;
		this.inventoryName = inventoryName;
		this.inventoryNombreOfElement = inventoryNombreOfElement;
		this.inventoryMaxLength = inventoryMaxLength;
		this.inventoryFoodList = inventoryFoodList;
		this.inventoryType = inventoryType;
	}

	getInventoryId() {
		return this.inventoryId;
	}

	getInventoryName() {
		return this.inventoryName;
	}

	getInventoryNombreOfElement() {
		return this.inventoryNombreOfElement;
	}

	getInventoryMaxLength() {
		return this.inventoryMaxLength;
	}

	getInventoryFoodList() {
		return this.inventoryFoodList;
	}

	getInventoryType() {
		return this.inventoryType;
	}

	addFood(food) {
		if (!(food instanceof Food)) {
			return "Objet pas de classe Food.";
		}
		if (this.isInventoryFull()) {
			return "L'inventaire est plein !";
		}
		this.inventoryFoodList.push(food);
		this.inventoryNombreOfElement++;
		return `${food.foodName} ajouté à l'inventaire.`;
	}

	isInventoryEmpty() {
		return this.inventoryNombreOfElement === 0;
	}

	isInventoryFull() {
		return this.inventoryNombreOfElement >= this.inventoryMaxLength;
	}

	removeFoodById(foodId) {
		const index = this.inventoryFoodList.findIndex(food => food.getFoodId() === foodId);
		if (index !== -1) {
			this.inventoryFoodList.splice(index, 1);
			this.inventoryNombreOfElement--;
			return `Aliment ${foodId} supprimé.`;
		}
		return "Aucun aliment avec cet ID trouvé.";
	}

	// Méthodes utilitaires supplémentaires

	getFoodById(id) {
		return this.inventoryFoodList.find(food => food.getFoodId() === id) || null;
	}

	clearInventory() {
		this.inventoryFoodList = [];
		this.inventoryNombreOfElement = 0;
	}

	getExpiredFoods(currentDate = new Date()) {
		return this.inventoryFoodList.filter(food => {
			const expDate = new Date(food.foodExpirationDate);
			return expDate < currentDate;
		});
	}
}

export default Furniture