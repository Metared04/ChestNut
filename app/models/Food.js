class Food
{
        constructor(
                foodId,
                foodName = "Inconnu",
                foodBrand = "",
                foodRegisteredDate = (new Date()).toISOString().split('T')[0],
                //foodOpeningDate = null,
                foodExpirationDate = (new Date(Date.now() + 86400000)).toISOString().split('T')[0],
                foodBarCode = "",
                foodQty = 1,
                //foodIsOpened = true,
                foodFurnitureStoredId = 1
        ) {
                this.foodId = foodId;
                this.foodName = foodName;
                this.foodBrand = foodBrand;
                this.foodRegisteredDate = foodRegisteredDate;
                //this.foodOpeningDate = foodOpeningDate || foodRegisteredDate;
                this.foodExpirationDate = foodExpirationDate ? 
                        foodExpirationDate : 
                        new Date(new Date(foodRegisteredDate).setDate(new Date(foodRegisteredDate).getDate() + 1)).toISOString().split('T')[0];
                this.foodBarCode = foodBarCode;
                this.foodQty = foodQty;
                //this.foodIsOpened = foodIsOpened;
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
                // console.log("Le produit ", this.foodName, " est PÉRIMÉ");
                return 0;
        } else if (this.foodIsAlmostExpired()) {
            // console.log("Le produit ", this.foodName, " expire bientôt !", this.foodDayLeft(), "jours restants)");
                return 1;
        } else {
                // console.log("Le produit ", this.foodName, " est encore bon pour", this.foodDayLeft(), "jours.");
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

        getNameAndKeywords() {
		const barCode = this.foodBarCode;
		console.log(" => ",barCode);

		return fetch(`https://world.openfoodfacts.org/api/v3/product/${barCode}.json`)
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

				const productRealName = data.product.product_name;
				const allProductCategories = data.product.categories.split(",");

				return { productRealName, allProductCategories };
			})
			.catch(error => {
				console.error("Erreur :", error);
				return null;
			});
	}
	
	async estimateExpirationDate() {
		const productInfos = await this.getNameAndKeywords();

		const categories = productInfos.allProductCategories;
		const mainKeyword = getMainCategoryFromKeywords(categories);
		const duration =  (mainKeyword);

		const estimatedExpiration = new Date();
		estimatedExpiration.setDate(estimatedExpiration.getDate() + duration);

		this.setExpirationDate(estimatedExpiration);

		return {
			mainKeyword,
			duration,
			estimatedExpiration
			};
	}
}

const categoryMap = {
	"abats frais": "Viandes",
	"viande hachée du boucher": "Viandes",
	"saucisses": "Viandes",
	"viande cuite emballée": "Viandes",
	"fruits de mer": "Poissons et Fruits de mer",
	"poissons crus": "Poissons et Fruits de mer",
	"charcuterie": "Charcuteries",
	"bacon": "Charcuteries",
	"charcuterie tranchée": "Charcuteries",
	"charcuterie préemballée": "Charcuteries",
	"crème fraîche au lait cru": "Crèmes",
	"crème fraîche pasteurisée": "Crèmes",
	"fromage râpé": "Fromages",
	"fromage frais": "Fromages",
	"fromage à pâte dure": "Fromages",
	"lait UHT": "Laits et Produits Laitiers Divers",
	"lait ultra-pasteurisé": "Laits et Produits Laitiers Divers",
	"beurre": "Laits et Produits Laitiers Divers",
	"oeufs frais": "Laits et Produits Laitiers Divers",
	"yaourt": "Produits Transformés à Base de Lait",
	"potage": "Soupe et Potage",
	"soupe": "Soupe et Potage",
	"sauce pour pâtes": "Sauces",
	"jus de fruit": "Jus de Fruits",
	"jus de fruit entamé": "Jus de Fruits",
	"raisins": "Fruits",
	"prunes": "Fruits",
	"pêche": "Fruits",
	"abricots": "Fruits",
	"pommes": "Fruits",
	"poivrons": "Fruits",
	"radis": "Fruits",
	"navet": "Fruits",
	"tomates": "Fruits",
	"courgettes": "Fruits",
	"concombre": "Fruits",
	"poireau": "Fruits",
	"carottes": "Légumes",
	"bettraves": "Légumes",
	"mayonnaise": "Condiments et Sauces",
	"ketchup": "Condiments et Sauces",
	"pommes de terre": "Épicerie",

};

const shelfLifeMap = {
  "abats frais": 1,
  "viande hachée du boucher": 1,
  "saucisses": 1,
  "fruits de mer": 1,
  "poissons crus": 1,
  "crême fraîche au lait cru": 2,
  "oeufs durs": 2,
  "viande cuite emballée": 2,
  "fruits rouge": 2,
  "yaourt": 3,
  "lait UHT": 3,
  "sauce pour pâtes": 3,
  "charcuterie": 3,
  "charcuteries": 3,
  "charcuterie tranchée": 3,
  "charcuterie préemballée": 3,
  "potage": 3,
  "soupe": 3,
  "crême fraîche pasteurisée": 4,
  "jus de fruit entamé": 5,
  "jus de fruit": 5,
  "raisins": 5,
  "prunes": 5,
  "lait ultra-pasteurisé": 7,
  "fromage rapé": 7,
  "fromage frais": 7,
  "pêche": 7,
  "abricots": 7,
  "poivrons": 7,
  "radis": 7,
  "navet": 7,
  "tomates": 7,
  "courgettes": 7,
  "concombre": 7,
  "poireau": 7,
  "beurre": 14,
  "frommage à pâte dure": 21,
  "oeufs frais": 21,
  "bettraves": 21,
  "mayonnaise": 60,
  "pommes": 60,
  "carottes": 90,
  "ketchup": 364,
};

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