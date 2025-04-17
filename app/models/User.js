import House from "./House";

class User {
	constructor(userId, userName, userMail, userPasswd, userIsPremium = false) {
		this.userId = userId;
		this.userName = userName;
		this.userMail = userMail;
		this.userPasswd = userPasswd;
		this.userIsPremium = userIsPremium;
		this.houses = [];
	}

	addHouse(house) {
		if (house instanceof House) {
			this.houses.push(house);
		}
	}

	getHouses() {
		return this.houses;
	}

	getAllFurniture() {
		return this.houses.flatMap(house => house.getFurnitureList());
	}

	getAllFoods() {
		return this.houses.flatMap(h => h.getAllFoodsOnThisHouse());
	}
}

export default User