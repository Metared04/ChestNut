class Food
{
	constructor(foodName = "Unknown", foodBrand = "Unknown", foodRegisteredDate = "2025-01-01", foodOpeningDate = null, foodExpirationDate = "2025-01-02", foodBarCode = "0000000000000", foodQty = 1, foodIsOpened = false)
	{
		this.foodName = foodName;
		this.foodBrand = foodBrand;
		this.foodRegisteredDate = new Date(foodRegisteredDate);
		this.foodOpeningDate = foodOpeningDate ? new Date(foodOpeningDate) : null;
		this.foodExpirationDate = new Date(foodExpirationDate);	
		this.foodBarCode = foodBarCode;
		this.foodQty = foodQty;
		// this.foodQty = Math.max(0, foodQty);
		this.foodIsOpened = foodIsOpened;
	}
	
	getFoodName(){
		return this.foodName;
	}
	
	getFoodIsOpened(){
		return this.foodIsOpened;
	}
	
	foodOpened(){
		if(!this.foodIsOpened){
			this.foodIsOpened = true;
			this.foodOpeningDate = new Date();
		}
	}
	
	getNumberOfValidityDays(){
		if(this.foodIsOpened === true && this.foodOpeningDate !== null){
			const startDate = this.foodOpeningDate;
			const nbOfValidityDays = this.foodExpirationDate - startDate;
			return Math.round(nbOfValidityDays) / (1000 * 60 * 60 * 24);
		}
		const startDate = this.foodRegisteredDate;
		const nbOfValidityDays = this.foodExpirationDate - startDate;
		
		return nbOfValidityDays / (1000 * 60 * 60 * 24);
	}
	
	foodIsAlmostExpired(){
		return this.getNumberOfValidityDays() <= 3 && this.getNumberOfValidityDays() > 0;
	}
	
	foodIsExpired(){
		return this.getNumberOfValidityDays() <= 0;
	}
	
}

export default Food