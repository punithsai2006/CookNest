// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.classList.toggle('open');
        button.classList.toggle('active');
    });
});

// Form submission alert
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert("Thank you for contacting CookNest! We’ll get back to you soon.");
    this.reset();
});

// Year update
document.getElementById('year').textContent = new Date().getFullYear();

// Recipe Search Functionality
function initRecipeSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const areaFilter = document.getElementById('areaFilter');
    const ingredientFilter = document.getElementById('ingredientFilter');
    const recipeResults = document.getElementById('recipeResults');
    // Load filters
    if (categoryFilter) {
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
            .then(response => response.json())
            .then(data => {
                data.meals.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.strCategory;
                    option.textContent = category.strCategory;
                    categoryFilter.appendChild(option);
                });
            });
    }
    if (areaFilter) {
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
            .then(response => response.json())
            .then(data => {
                data.meals.forEach(area => {
                    const option = document.createElement('option');
                    option.value = area.strArea;
                    option.textContent = area.strArea;
                    areaFilter.appendChild(option);
                });
            });
    }
    if (ingredientFilter) {
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
            .then(response => response.json())
            .then(data => {
                data.meals.forEach(ingredient => {
                    const option = document.createElement('option');
                    option.value = ingredient.strIngredient;
                    option.textContent = ingredient.strIngredient;
                    ingredientFilter.appendChild(option);
                });
            });
    }
    // Search function
    function searchRecipes() {
        const searchTerm = searchInput.value.trim();
        const category = categoryFilter.value;
        const area = areaFilter.value;
        const ingredient = ingredientFilter.value;
        let apiUrl = 'https://www.themealdb.com/api/json/v1/1/';
        if (searchTerm) {
            apiUrl += `search.php?s=${searchTerm}`;
        } else if (category) {
            apiUrl += `filter.php?c=${category}`;
        } else if (area) {
            apiUrl += `filter.php?a=${area}`;
        } else if (ingredient) {
            apiUrl += `filter.php?i=${ingredient}`;
        } else {
            apiUrl += 'search.php?s=';
        }
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                recipeResults.innerHTML = '';
                if (!data.meals) {
                    recipeResults.innerHTML = '<p>No recipes found. Try a different search.</p>';
                    return;
                }
                data.meals.forEach(meal => {
                    const recipeCard = document.createElement('div');
                    recipeCard.className = 'recipe-card';

                    recipeCard.innerHTML = `
                        <img src="${meal.strMealThumb || 'https://www.themealdb.com/images/ingredients/lime-small.png'}" alt="${meal.strMeal}">
                        <div class="recipe-card-content">
                            <h4>${meal.strMeal}</h4>
                            <p>${meal.strArea || ''} ${meal.strCategory ? `• ${meal.strCategory}` : ''}</p>
                            <a href="recipe-detail.html?id=${meal.idMeal}" class="view-recipe">View Recipe</a>
                        </div>
                    `;
                    recipeResults.appendChild(recipeCard);
                });
            });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', searchRecipes);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchRecipes();
            }
        });
    }
    [categoryFilter, areaFilter, ingredientFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', searchRecipes);
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const recipeId = "himachal-chana-madra";
    const favoriteBtn = document.getElementById("favoriteBtn");

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let isFavorite = favorites.some((fav) => fav.id === recipeId);

    function updateFavoriteButton() {
        if (isFavorite) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
            favoriteBtn.classList.add("favorited");
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
            favoriteBtn.classList.remove("favorited");
        }
    }

    updateFavoriteButton();

    favoriteBtn.addEventListener("click", () => {
        const index = favorites.findIndex((fav) => fav.id === recipeId);
        if (index === -1) {
            favorites.push({
                id: recipeId,
                name: "Chana Madra",
                image: "himachal.jpg",           
                area: "Himachal Pradesh",
                category: "Curry",
                page: "himachal-pradesh.html"  
            });
            isFavorite = true;
        } else {
            favorites.splice(index, 1);
            isFavorite = false;
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoriteButton();
    });
});
