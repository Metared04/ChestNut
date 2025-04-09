class Food
{
        constructor(foodId = Math.floor(Math.random() * (1500 - 500 + 1)) + 500, foodName = "", foodBrand = "", foodRegisteredDate = new Date().toISOString().split('T')[0], foodOpeningDate = null, foodExpirationDate = "2025-01-02", foodBarCode = "", foodQty = 1, foodIsOpened = false) 
        {
                this.foodId = foodId;
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

        getFoodName() {
                return this.foodName;
        }

        getFoodIsOpened(){
                return this.foodIsOpened;
        }

        setRegisteredDate(date) {
                this.foodRegisteredDate = new Date(date);
        }
        
        setOpeningDate(date) {
                this.foodOpeningDate = date ? new Date(date) : null;
        }
        
        setExpirationDate(date) {
                this.foodExpirationDate = new Date(date);
        }

        setFoodIsOpened(state){
                this.foodIsOpened = state;
        }

        foodOpened(){
                if(!this.foodIsOpened){
                        this.setFoodIsOpened(true);
                        this.setOpeningDate(new Date());
                }
        }

        getNumberOfValidityDays(){
                const today = new Date();
                if(this.foodIsOpened === true && this.foodOpeningDate !== null){
                        const startDate = this.foodOpeningDate;
                        const nbOfValidityDays = this.foodExpirationDate - today;
                        console.log("Trouve !")
                return Math.round((nbOfValidityDays) / (1000 * 60 * 60 * 24)) + 1;
                }
                const startDate = this.foodRegisteredDate;
                const nbOfValidityDays = this.foodExpirationDate - today;

                return Math.round((nbOfValidityDays) / (1000 * 60 * 60 * 24)) + 1;
        }

        foodIsAlmostExpired(){
                return this.getNumberOfValidityDays() <= 3 && this.getNumberOfValidityDays() > 0;
        }

        foodIsExpired(){
                return this.getNumberOfValidityDays() <= 0;
        }

        getExpirationStatus(){
        if (this.foodIsExpired()) {
                // console.log("Le produit ", this.foodName, " est PÉRIMÉ");
                return 0;
        } else if (this.foodIsAlmostExpired()) {
            // console.log("Le produit ", this.foodName, " expire bientôt !", this.getNumberOfValidityDays(), "jours restants)");
                return 1;
        } else {
                // console.log("Le produit ", this.foodName, " est encore bon pour", this.getNumberOfValidityDays(), "jours.");
                return 2;
                }
        }

        checkExpirationStatus() {
                if (this.getExpirationStatus() == 0){
                        return "Le produit " + this.foodName + " est PÉRIMÉ";
                } else if (this.getExpirationStatus() == 1){
                        return "Le produit " + this.foodName + " expire bientôt ! " + this.getNumberOfValidityDays() + " jours restants";
                } else if (this.getExpirationStatus() == 2){
                        return "Le produit " + this.foodName + " est encore bon pour " + Math.round(this.getNumberOfValidityDays()) + " jours.";
                } else {
                        return "Probleme de reconnaissance du produit";
                }
        }

        getFoodIcon() {
                const name = this.foodName.toLowerCase();

                if (name.includes("poulet")) return 'drumstick-bite';
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

        getKeyword(){
                const barCode = this.foodBarCode;

                fetch(`https://world.openfoodfacts.org/api/v3/product/${barCode}.json`)
		.then(response => {
			if (!response.ok) {
				//throw new Error("Erreur : ", response.status);
                                return "null"
			}
			return response.json();
		})
		.then(data => {
			if(!data.product) {
				console.error("Produit introuvable.");
				return "null";
			}
			
                        return data.product.categories.split(",");
	        })
	        .catch(error => console.error("Erreur :", error));
        }

        async recommandedConservationDuration() {
                const keywords = await this.getKeyword();
                switch(keywords)
                {
                        case "abats frais":
                        case "viande hachée du boucher":
                        case "saucisses":
                        case "fruits de mer":
                        case "poissons crus":
                                return 1;
                        case "crême fraîche au lait cru":
                        case "oeufs durs":
                        case "viande cuite emballée":
                        case "fruits rouge":
                                return 2;
                        case "yaourt":
                        case "lait UHT":
                        case "sauce pour pâtes":
                        case "charcuterie tranchée":
                        case "charcuterie préemballée":
                        case "potage":
                        case "soupe":
                                return 3;
                        case "crême fraîche pasteurisée":
                                return 4;
                        case "jus de fruit entamé":
                        case "jus de fruit":
                        case "raisins":
                        case "prunes":
                                return 5;
                        case "lait ultra-pasteurisé":
                        case "fromage rapé":
                        case "fromage frais":
                        case "pêche":
                        case "abricots":
                        case "poivrons":
                        case "radis":
                        case "navet":
                        case "tomates":
                        case "courgettes":
                        case "concombre":
                        case "poireau":
                                return 7;
                        case "beurre":
                                return 14;
                        case "frommage à pâte dure":
                        case "oeufs frais":
                        case "bettraves":
                                return 21;
                        case "mayonnaise":
                        case "pommes":
                                return 60;
                        case "carottes":
                                return 90;
                        case "ketchup":
                                return 364;
                        case "null":
                                return 0;
                }
        }
}

export default Food