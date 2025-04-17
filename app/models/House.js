class House {
  constructor(houseId, houseName, ownerUserId) {
		this.houseId = houseId;
		this.houseName = houseName;
		this.ownerUserId = ownerUserId;
		this.furnitureList = [];
		this.guests = [];
  }

	addFurniture(furniture) {
		this.furnitureList.push(furniture);
	}

	getFurnitureList() {
		return this.furnitureList;
	}

	getFurnitureById(id) {
		return this.furnitureList.find(f => f.inventoryId === id);
	}

	getAllFoodsOnThisHouse() {
		return this.furnitureList.flatMap(f => f.getInventoryFoodList());
	}

	addGuest(user) {
		this.guests.push(user);
	}

	getGuests() {
		return this.guests;
	}
}

export default House