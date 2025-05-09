import Food from "./Food";

class Furniture {
	constructor(
		furnitureId,
		furnitureName = "Meuble inconnue",
		furnitureNombreOfElement = 0,
		furnitureMaxLength = 25,
		furnitureFoodList = [],
		furnitureType = new Set(["Frigo", "Congelateur"])
	) {
		if (!furnitureName || furnitureName.trim() === "") {
			throw new Error("Le nom de l'inventaire ne peut pas être vide.");
		}

		if (!Number.isInteger(furnitureMaxLength) || furnitureMaxLength <= 0) {
			throw new Error("La capacité maximale doit être un entier positif.");
		}

		this.furnitureId = furnitureId;
		this.furnitureName = furnitureName;
		this.furnitureNombreOfElement = furnitureNombreOfElement;
		this.furnitureMaxLength = furnitureMaxLength;
		this.furnitureFoodList = furnitureFoodList;
		this.furnitureType = furnitureType;
	}

	getFurnitureId() {
		return this.furnitureId;
	}

	getFurnitureName() {
		return this.furnitureName;
	}

	getFurnitureNombreOfElement() {
		return this.furnitureNombreOfElement;
	}

	getFurnitureMaxLength() {
		return this.furnitureMaxLength;
	}

	getFurnitureFoodList() {
		return this.furnitureFoodList;
	}

	getFurnitureType() {
		return this.furnitureType;
	}

	getAllFoodsWithFurnitureInfo() {
		return this.furnitureFoodList.map(food => ({
			...food,
			furnitureId: this.furnitureId,
			furnitureName: this.furnitureName,
			furnitureType: this.furnitureType
		}));
	  }

	addFood(food) {
		if (!(food instanceof Food)) {
			return "Objet pas de classe Food.";
		}
		if (this.isInventoryFull()) {
			return "L'inventaire est plein !";
		}
		this.furnitureFoodList.push(food);
		this.furnitureNombreOfElement++;
		return `${food.foodName} ajouté à l'inventaire.`;
	}

	isInventoryEmpty() {
		return this.furnitureNombreOfElement === 0;
	}

	isInventoryFull() {
		return this.furnitureNombreOfElement >= this.furnitureMaxLength;
	}

	removeFoodById(foodId) {
		const index = this.furnitureFoodList.findIndex(food => food.getFoodId() === foodId);
		if (index !== -1) {
			this.furnitureFoodList.splice(index, 1);
			this.furnitureNombreOfElement--;
			return `Aliment ${foodId} supprimé.`;
		}
		return "Aucun aliment avec cet ID trouvé.";
	}

	getFoodById(id) {
		return this.furnitureFoodList.find(food => food.getFoodId() === id) || null;
	}

	clearInventory() {
		this.furnitureFoodList = [];
		this.furnitureNombreOfElement = 0;
	}

	getExpiredFoods(currentDate = new Date()) {
		return this.furnitureFoodList.filter(food => {
			const expDate = new Date(food.foodExpirationDate);
			return expDate < currentDate;
		});
	}
}

export default Furniture