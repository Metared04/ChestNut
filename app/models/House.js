import Furniture from "./Furniture";

class House {
  	constructor(
		houseId, 
		houseName, 
		houseOwnerUserId, 
		houseFurnitureList = [], 
		guestsList = []
	) {
		this.houseId = houseId;
		this.houseName = houseName;
		this.houseOwnerUserId = houseOwnerUserId;
		this.houseFurnitureList = houseFurnitureList;
		this.guestsList = guestsList;
  	}

	getHouseId(){
		return this.houseId;
	}

	getHouseName(){
		return this.houseName;
	}

	getHouseOwnerUserId(){
		return this.houseOwnerUserId;
	}

	getHouseFurnitureList() {
		return this.houseFurnitureList;
	}

	getGuestsList() {
		return this.guestsList;
	}

	getFurnitureById(id) {
		return this.houseFurnitureList.find(f => f.furnitureId === id);
	}

	getAllFoodsOnThisHouse() {
		return this.houseFurnitureList.flatMap(f => f.getFurnitureFoodList());
	}

	getAllFoodsWithDetails() {
		return this.houseFurnitureList.flatMap(f => 
			f.getAllFoodsWithFurnitureInfo().map(food => ({
				...food,
				houseId: this.houseId,
				houseName: this.houseName
			}))
		);
	}

	addFurniture(furniture) {
		this.houseFurnitureList.push(furniture);
	}

	addGuest(user) {
		this.guests.push(user);
	}

}

export default House