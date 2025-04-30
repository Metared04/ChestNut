class Food
{
        constructor(
                foodId,
                foodName = "Inconnu",
                foodBrand = "",
                foodRegisteredDate = (new Date()).toISOString().split('T')[0],
                foodExpirationDate = (new Date(Date.now() + 86400000)).toISOString().split('T')[0],
                foodBarCode = "",
                foodQty = 1,
                foodFurnitureStoredId = 1
        ) {
                this.foodId = foodId;
                this.foodName = foodName;
                this.foodBrand = foodBrand;
                this.foodRegisteredDate = foodRegisteredDate;
                this.foodExpirationDate = foodExpirationDate ? 
                        foodExpirationDate : 
                        new Date(new Date(foodRegisteredDate).setDate(new Date(foodRegisteredDate).getDate() + 1)).toISOString().split('T')[0];
                this.foodBarCode = foodBarCode;
                this.foodQty = foodQty;
                this.foodFurnitureStoredId = foodFurnitureStoredId;
        }

        getFoodId(){
                return this.foodId;
        }

        getFoodName() {
                return this.foodName;
        }

        getFoodBrand(){
                return this.foodBrand
        }

        getRegisteredDate(){
                return this.foodRegisteredDate
        }

        getExpirationDate(){
                return this.foodExpirationDate
        }

        getFoodBarCode(){
                return this.foodBarCode;
        }

        getFoodQty(){
                return this.foodQty;
        }

        getFoodFurnitureStoredId(){
                return this.foodFurnitureStoredId;
        }

        setFoodName(newName){
                this.foodName = newName;
        }

        setFoodBrand(newBrand){
                this.foodBrand = newBrand;
        }

        setRegisteredDate(newDate) {
                this.foodRegisteredDate = new Date(newDate);
        }
        
        setExpirationDate(newDate) {
                this.foodExpirationDate = new Date(newDate);
        }

        setFoodQty(newQty){
               if(newQty > 0){
                        this.foodQty = newQty;
               } 
        }

        setFoodIsOpened(state){
                this.foodIsOpened = state;
        }

        setFoodFurnitureStoredId(location){
                this.foodFurnitureStoredId = location;
        }

        foodOpened(){
                if(!this.foodIsOpened){
                        this.setFoodIsOpened(true);
                        this.setOpeningDate(new Date());
                }
        }

        foodDayLeft(){
                const today = new Date();
                const endDate = new Date(this.foodExpirationDate);
                const nbOfValidityDays = endDate - today;

                return Math.round((nbOfValidityDays) / (1000 * 60 * 60 * 24)) + 1;
        }

        foodIsAlmostExpired(){
                return this.foodDayLeft() <= 3 && this.foodDayLeft() > 0;
        }

        foodIsExpired(){
                return this.foodDayLeft() <= 0;
        }

        getExpirationStatus(){
        if (this.foodIsExpired()) {
                return 0;
        } else if (this.foodIsAlmostExpired()) {
                return 1;
        } else {
                return 2;
                }
        }

        checkExpirationStatus() {
                if (this.getExpirationStatus() == 0){
                        return "Le produit " + this.foodName + " est PÉRIMÉ";
                } else if (this.getExpirationStatus() == 1){
                        return "Le produit " + this.foodName + " expire bientôt ! " + this.foodDayLeft() + " jours restants";
                } else if (this.getExpirationStatus() == 2){
                        return "Le produit " + this.foodName + " est encore bon pour " + Math.round(this.foodDayLeft()) + " jours.";
                } else {
                        return "Probleme de reconnaissance du produit";
                }
        }

        getFoodIcon() {
                const name = this.foodName.toLowerCase();

                if (name.includes("lait") || name.includes("crème")) return 'glass';
                if (name.includes("boeuf") || name.includes("steak")) return 'cutlery';
                if (name.includes("yaourt") || name.includes("yop")) return 'glass';
                if (name.includes("pâtes") || name.includes("bolognaise")) return 'cutlery';

                return 'shopping-basket';
        }

        async getOpenFoodFactsData(){
                if (this.foodBarCode === ""){
                        return null;
                } else {
                        return fetch(`https://world.openfoodfacts.org/api/v3/product/${this.foodBarCode}.json`)
			.then(response => {
				console.log("Réponse reçue :", response.status);
				if (!response.ok) {
					console.error("Erreur HTTP :", response.status);
					return null;
				}
				return response.json();
			})
			.then(data => {
				if (!data.product) {
					console.error("Produit introuvable.");
					return null;
				}

				const productRealName = data.product.product_name || "";
				const allProductCategories = data.product.categories.split(",");
                                //return productRealName;
				return { productRealName, allProductCategories };
			})
			.catch(error => {
				console.error("Erreur :", error);
				return null;
			});
                }
        }
        
        /*
                const data = await food.extractKeywords();

        */


	async estimateExpirationDate() {
		const productInfos = await this.getNameAndKeywords();
                if (productInfos === null){
                        const res = "Impossible d'avoir une date recommande.";
                        return {
                                res
                        }
                } else {
                        /*
                        const categories = productInfos.allProductCategories;
		        const mainKeyword = getMainCategoryFromKeywords(categories);
		        //const duration =  (mainKeyword);
                        const duration = shelfLifeMap[mainKeyword] || shelfLifeMap["autre"];
		        const estimatedExpiration = new Date();
		        estimatedExpiration.setDate(estimatedExpiration.getDate() + duration);

		        this.setExpirationDate(estimatedExpiration);
                        */
		        return productInfos;
                }
		
	}
}



function getMainCategoryFromKeywords(keywords) {
	//console.log(" ->  ", typeof(keywords));
        const lowerKeywords = keywords.map(k => k.trim().toLowerCase());
        // console.log(" ->  ", typeof(lowerKeywords));
        for (let keyword of lowerKeywords) {
                for (let key in categoryMap) {
                        if (keyword.includes(key)) {
                                return categoryMap[key].toLowerCase();
                        }
                }
        }

        return "autre";
}

export default Food

/*
getFoodIcon() {
                const name = this.foodName.toLowerCase();

                //if (name.includes("poulet")) return 'drumstick-bite';
                if (name.includes("lait") || name.includes("crème")) return 'glass';
                if (name.includes("boeuf") || name.includes("steak")) return 'cutlery';
                if (name.includes("yaourt") || name.includes("yop")) return 'glass';
                if (name.includes("pâtes") || name.includes("bolognaise")) return 'cutlery';
                //if (name.includes("bacon")) return 'bacon';
                //if (name.includes("fromage")) return "🧀";
                //if (name.includes("poisson") || name.includes("saumon")) return 'fish-cooked';
                //if (name.includes("dessert") || name.includes("sucré")) return "🍰";
                return 'shopping-basket';
        }


        getFoodIsOpened(){
                return this.foodIsOpened;
        }

        setOpeningDate(newDate) {
                this.foodOpeningDate = newDate ? new Date(newDate) : null;
        }
*/