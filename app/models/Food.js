class Food
{
        constructor(foodId = Math.floor(Math.random() * (1500 - 500 + 1)) + 500, foodName = "", foodBrand = "", foodRegisteredDate = "2025-01-01", foodOpeningDate = null, foodExpirationDate = "2025-01-02", foodBarCode = "", foodQty = 1, foodIsOpened = false) 
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

}

export default Food