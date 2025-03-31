class Food
{
	constructor( foodName = "Unknown", foodBrand = "Unknown", foodDateStart = "01-01-2025", foodExpiryDate = "02-01-2025", foodBarCode = "0000000000000", foodQty = 1, foodIsOpened = false)
	{
		this.foodName = foodName;
		this.foodBrand = foodBrand;
		this.foodDateStart = foodDateStart;
		this.foodExpiryDate = foodExpiryDate;	
		this.foodBarCode = foodBarCode;
		this.foodQty = foodQty;
		this.foodIsOpened = foodIsOpened;
	}

	getCodebarre(){
		console.log("Affichage scanneur code barre.");
	}
}