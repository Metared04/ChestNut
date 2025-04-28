import House from "./House";

class User {
	constructor(userId, userName, userMail, userPasswd, userIsPremium = false, housesList) {
		this.userId = userId;
		this.userName = userName;
		this.userMail = userMail;
		this.userPasswd = userPasswd;
		this.userIsPremium = userIsPremium;
		this.housesList = [];
	}

	getUserId(){
		return this.userId;
	}

	getUserName(){
		return this.userName;
	}

	getUserMail(){
		return this.userMail;
	}

	getUserPasswd(){
		return this.userPasswd;
	}

	getUserIsPremium(){
		return this.userIsPremium;
	}

	getHousesList() {
		return this.housesList;
	}

	addHouse(house) {
		if (house instanceof House) {
			this.housesList.push(house);
		}
	}

	getAllFurniture() {
		return this.housesList.flatMap(house => house.getFurnitureList());
	}

	getAllFoods() {
		return this.housesList.flatMap(h => h.getAllFoodsOnThisHouse());
	}

	getAllFoodsWithDetails() {
		return this.housesList.flatMap(h => h.getAllFoodsWithDetails());
	}

	getFurnitureById(id) {
		for (const house of this.housesList) {
			for (const furniture of house.furnitureList) {
				if (furniture.furnitureId === id) return furniture;
			}
		}
		return null;
	}

	findHouseOfFood(targetFood) {
		for (const house of this.housesList) {
			for (const furniture of house.furnitureList) {
				if (furniture.foodList.includes(targetFood)) {
					return house;
				}
		  	}
		}
		return null; // Si l'aliment n'est trouvé dans aucune maison
	}
}

export default User