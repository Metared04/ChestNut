class Food
{
	constructor( foodName = "Unknown", foodBrand = "Unknown", foodDateStart = "2025-01-01", foodDateExpiry = "2025-01-02", foodBarCode = "0000000000000", foodQty = 1, foodIsOpened = false)
	{
		this.foodName = foodName;
		this.foodBrand = foodBrand;
		this.foodDateStart = new Date(foodDateStart);
		this.foodDateExpiry = new Date(foodDateExpiry);	
		this.foodBarCode = foodBarCode;
		this.foodQty = foodQty;
		// this.foodQty = Math.max(0, foodQty);
		this.foodIsOpened = foodIsOpened;
	}

	getBarCode(){
		console.log("Affichage scanneur code barre.");
	}
	
	getFoodName(){
		return this.foodName;
	}
	
	isAlmostExpiry(){
		const copyDate = this.foodDateStart;
		copyDate.setDate(copyDate.getDate() + 3);
		return copyDate;
	}
	
	getNumberOfValidityDays(){
		const test = this.foodDateExpiry - this.foodDateStart;
		
		return test / (1000 * 60 * 60 * 24);
	}
	
	isAlmostExpired(){
		return this.getNumberOfValidityDays() < 3;
	}
	
	isExpired(){
		return this.getNumberOfValidityDays() >= 0;
	}
}

export default Food