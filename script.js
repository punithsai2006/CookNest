// Main JavaScript for CookNest
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('#newsletterForm');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            this.reset();
        });
    });
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#name').value;
            alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
            this.reset();
        });
    }
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
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
// Recipe Detail Functionality
function initRecipeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (recipeId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];                
                // Set recipe details
                document.getElementById('recipeTitle').textContent = meal.strMeal;
                document.getElementById('recipeImage').src = meal.strMealThumb;
                document.getElementById('recipeCategory').textContent = meal.strCategory;
                document.getElementById('recipeArea').textContent = meal.strArea;
                document.getElementById('recipeInstructions').textContent = meal.strInstructions;               
                // Set ingredients
                const ingredientsList = document.getElementById('ingredientsList');
                ingredientsList.innerHTML = '';
                
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    
                    if (ingredient && ingredient.trim() !== '') {
                        const li = document.createElement('li');
                        li.innerHTML = `<i class="fas fa-check-circle"></i> ${measure} ${ingredient}`;
                        ingredientsList.appendChild(li);
                    }
                }                
                // Set video if available
                const videoContainer = document.getElementById('videoContainer');
                if (meal.strYoutube) {
                    const videoId = meal.strYoutube.split('v=')[1];
                    videoContainer.innerHTML = `
                        <h3>Video Tutorial</h3>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen></iframe>
                    `;
                }               
                // Check if recipe is in favorites
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                const isFavorite = favorites.some(fav => fav.id === meal.idMeal);
                
                if (isFavorite) {
                    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
                    favoriteBtn.classList.add('favorited');
                }
                
                // Favorite button functionality
                favoriteBtn.addEventListener('click', () => {
                    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    const index = favorites.findIndex(fav => fav.id === meal.idMeal);
                    
                    if (index === -1) {
                        // Add to favorites
                        favorites.push({
                            id: meal.idMeal,
                            name: meal.strMeal,
                            image: meal.strMealThumb,
                            area: meal.strArea,
                            category: meal.strCategory
                        });
                        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
                        favoriteBtn.classList.add('favorited');
                    } else {
                        // Remove from favorites
                        favorites.splice(index, 1);
                        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
                        favoriteBtn.classList.remove('favorited');
                    }
                    
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                });
            });
    }
}
// Favorites Page Functionality
function initFavoritesPage() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    
    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (favorites.length === 0) {
            noFavoritesMessage.style.display = 'block';
            return;
        }
        
        noFavoritesMessage.style.display = 'none';
        favoritesContainer.innerHTML = '';
        
        favorites.forEach(meal => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            
            recipeCard.innerHTML = `
                <img src="${meal.image || 'https://www.themealdb.com/images/ingredients/lime-small.png'}" alt="${meal.name}">
                <div class="recipe-card-content">
                    <h4>${meal.name}</h4>
                    <p>${meal.area || ''} ${meal.category ? `• ${meal.category}` : ''}</p>
                    <a href="recipe-detail.html?id=${meal.id}" class="view-recipe">View Recipe</a>
                    <button class="remove-favorite" data-id="${meal.id}">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            `;
            
            favoritesContainer.appendChild(recipeCard);
        });       
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const mealId = e.currentTarget.getAttribute('data-id');
                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                favorites = favorites.filter(fav => fav.id !== mealId);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                displayFavorites();
            });
        });
    }   
    displayFavorites();
}
// Indian Recipes Page Functionality with accurate state-wise dishes
function initIndianRecipes() {
    const indianRecipesContainer = document.getElementById('indianRecipesContainer');
    
    // Updated with accurate state-wise famous dishes
    const indianStateRecipes = [
        { state: 'Punjab', dish: 'Sarson ka Saag', id: '52795' }, // Corrected from Butter Chicken
        { state: 'Gujarat', dish: 'Khandvi', id: '53012' }, // Corrected from Dhokla
        { state: 'West Bengal', dish: 'Shorshe Ilish', id: '52878' }, // Corrected from Rasgulla
        { state: 'Maharashtra', dish: 'Puran Poli', id: '53042' }, // Corrected from Pav Bhaji
        { state: 'Tamil Nadu', dish: 'Chettinad Chicken', id: '53011' }, // Corrected from Dosa
        { state: 'Kerala', dish: 'Appam with Stew', id: '52861' }, // Kept Appam as it's accurate
        { state: 'Rajasthan', dish: 'Dal Baati Churma', id: '52807' }, // Accurate
        { state: 'Karnataka', dish: 'Bisi Bele Bath', id: '52812' }, // Accurate
        { state: 'Andhra Pradesh', dish: 'Gongura Chicken', id: '53013' }, // Corrected from Hyderabadi Biryani
        { state: 'Bihar', dish: 'Litti Chokha', id: '52828' }, // Accurate
        { state: 'Uttar Pradesh', dish: 'Galouti Kebab', id: '52838' }, // More specific than just Kebabs
        { state: 'Goa', dish: 'Goan Fish Curry', id: '52845' }, // Accurate
        { state: 'Assam', dish: 'Masor Tenga', id: '52852' }, // Accurate
        { state: 'Odisha', dish: 'Chhena Poda', id: '53014' }, // Corrected from Pakhala Bhata
        { state: 'Himachal Pradesh', dish: 'Siddu', id: '52866' }, // Accurate
        { state: 'Kashmir', dish: 'Rogan Josh', id: '52822' }, // Added missing state
        { state: 'Telangana', dish: 'Hyderabadi Biryani', id: '52821' }, // Added missing state
        { state: 'Uttarakhand', dish: 'Kafuli', id: '53015' }, // Added missing state
        { state: 'Madhya Pradesh', dish: 'Poha Jalebi', id: '53016' }, // Added missing state
        { state: 'Jharkhand', dish: 'Thekua', id: '53017' } // Added missing state
    ];

    // Show loading state
    indianRecipesContainer.innerHTML = '<p class="loading">Loading authentic Indian recipes...</p>';
    
    // Track successful fetches
    let successfulFetches = 0;
    const totalRecipes = indianStateRecipes.length;
    
    indianStateRecipes.forEach(recipe => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.id}`)
            .then(response => response.json())
            .then(data => {
                successfulFetches++;
                
                if (!data.meals || data.meals.length === 0) {
                    // Fallback for missing recipes
                    console.warn(`Recipe not found for ${recipe.dish} (ID: ${recipe.id})`);
                    if (successfulFetches === totalRecipes) {
                        updateUI();
                    }
                    return;
                }

                const meal = data.meals[0];
                
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card';
                
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb || 'https://www.themealdb.com/images/ingredients/lime-small.png'}" alt="${meal.strMeal}">
                    <div class="recipe-card-content">
                        <h4>${meal.strMeal}</h4>
                        <p>${recipe.state} • ${meal.strCategory}</p>
                        <a href="recipe-detail.html?id=${meal.idMeal}" class="view-recipe">View Recipe</a>
                    </div>
                `;
                
                // Add to container immediately
                indianRecipesContainer.appendChild(recipeCard);
                
                // Check if all recipes are loaded
                if (successfulFetches === totalRecipes) {
                    updateUI();
                }
            })
            .catch(error => {
                console.error(`Error fetching recipe for ${recipe.dish}:`, error);
                successfulFetches++;
                if (successfulFetches === totalRecipes) {
                    updateUI();
                }
            });
    });

    function updateUI() {
        // Remove loading message if any recipes loaded
        if (indianRecipesContainer.querySelector('.loading') && successfulFetches > 0) {
            indianRecipesContainer.querySelector('.loading').remove();
        }
        
        // Show message if no recipes found
        if (successfulFetches === 0) {
            indianRecipesContainer.innerHTML = '<p class="error">Could not load recipes. Please try again later.</p>';
        }
    }
}
// Initialize appropriate functions based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...  
    // Initialize recipe search page
    if (document.getElementById('searchInput')) {
        initRecipeSearch();
    }
    // Initialize recipe detail page
    if (document.getElementById('recipeTitle')) {
        initRecipeDetail();
    }
    // Initialize favorites page
    if (document.getElementById('favoritesContainer')) {
        initFavoritesPage();
    }
    // Initialize Indian recipes page
    if (document.getElementById('indianRecipesContainer')) {
        initIndianRecipes();
    }
});