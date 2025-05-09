async function getAllPotentialsCategories(allCategories) {
    try {
        var matchedCategory = [];
        for(let i = 0; i < allCategories.length; i++) {
            const getCategories = await allService.fetchAllProductCategories(allCategories[i].toLowerCase().normalize().trim());
             if (getCategories.length !== 0){
                matchedCategory.push(getCategories)
            };
        }
        return(matchedCategory);
    }
        catch(error){
            console.error("Erreur lors de la recupération des catégories sur open food fact :", error);
        }
}

async function getAllMatchedCategories(allPotentialCategories) {
    if(allPotentialCategories.length === 0){
        return [];
    } else {
        try {
            console.log("liste categorie : ", allPotentialCategories);
            var allMatchedCategories = [];
            for(let i= 0; i < allPotentialCategories.length; i++) {
                const getProducts = await allService.filtrationCategories(allPotentialCategories[i].category_id);
                if (getProducts.length !== 0){
                    for(let i= 0; i < getProducts.length; i++){
                        allMatchedCategories.push(getProducts[i]);
                    }
                };
            }
            return(allMatchedCategories);
        }
        catch(error){
            console.error("Erreur dans getAllMatchedCategories :", error);
        }
    }
}

function findMostSimilarName(refName, allPotentialNameList) {
    if(allPotentialNameList.length === 0){
        return "";
    } else {
        let bestName = null;
        let bestLevenshteinScore = Infinity;

        for (const candidat of allPotentialNameList) {
            const levenshteinScore = nameSimilarity(refName, candidat.product_name);
            if (levenshteinScore < bestLevenshteinScore) {
                bestLevenshteinScore = levenshteinScore;
                bestName = candidat;
            }
        }

        return bestName;
    }
}

function nameSimilarity(correctName, nameToCompared) {
    const nameA = correctName.toLowerCase().trim().split(/\s+/);
    const nameB = nameToCompared.toLowerCase().trim().split(/\s+/);

    let totalScore = 0;

    for (const wordB of nameB) {
        let minScore = Infinity;
        for (const wordA of nameA) {
            const score = levenshtein(wordA, wordB);
            minScore = Math.min(minScore, score);
        }

        // BONUS : si le mot est présent tel quel, réduis fortement le score
        if (nameA.includes(wordB)) {
            minScore -= 2; // ou * 0.5, ou fixe à 0
        }

        totalScore += Math.max(minScore, 0); // évite score négatif
    }

    return totalScore;
}

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
        );
        }
    }
    return matrix[a.length][b.length];
}

function getProductDuration(product){
    if(product.length === 0){
        return 1;
    } else {
        return product.product_duration;
    }
}

async function estimateProductShelfLife(unNom, uneListe){
    const potentialCategories = await getAllPotentialsCategories(uneListe);
    const potentialProducts = await getAllMatchedCategories(potentialCategories);
    const testName = findMostSimilarName(unNom, potentialProducts);

    return getProductDuration(testName);
}

// export default estimateProductShelfLife;