const recipeForm = document.getElementById('recipe-form');
const recipesList = document.getElementById('recipes-list');
const favoritesList = document.getElementById('favorites-list'); // Agregar referencia para recetas favoritas
const searchInput = document.getElementById('search');

// Función para agregar receta
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value;
    const preparation = document.getElementById('preparation').value;

    const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, ingredients, preparation }),
    });
    const recipe = await response.json();
    recipeForm.reset();
    displayRecipe(recipe);
});

// Buscar recetas
searchInput.addEventListener('input', async () => {
    const search = searchInput.value;
    const response = await fetch(`/api/recipes?search=${search}`);
    const recipes = await response.json();
    recipesList.innerHTML = '';
    recipes.forEach(displayRecipe);
});

// Mostrar receta
function displayRecipe(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
        <h2>${recipe.title}</h2>
        <h4>Ingredientes: ${recipe.ingredients}</h4>
        <p>Preparación: ${recipe.preparation}</p>
        <p>Puntuación promedio: ${recipe.averageRating ? recipe.averageRating.toFixed(1) : 'Sin calificaciones'}</p>
        <div class="rating" data-id="${recipe._id}">
            ${[1, 2, 3, 4, 5].map(star => `
                <span class="star" data-value="${star}">⭐</span>
            `).join('')}
        </div>
        <button class="favorite-btn" data-id="${recipe._id}">
            ${recipe.isFavorite ? 'Eliminar de Favoritos' : 'Agregar a Favoritos'}
        </button>
    `;
    recipesList.appendChild(recipeDiv);

    // Agregar evento para calificar
    const stars = recipeDiv.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', async () => {
            const rating = star.dataset.value;
            const response = await fetch(`/api/recipes/${recipe._id}/rating`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: Number(rating) }),
            });
            const updatedRecipe = await response.json();
            recipeDiv.querySelector('p').innerText = `Puntuación promedio: ${updatedRecipe.averageRating.toFixed(1)}`;
        });
    });

    // Agregar evento para manejar favoritos
    const favoriteBtn = recipeDiv.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', async () => {
        const response = await fetch(`/api/recipes/${recipe._id}/favorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const updatedRecipe = await response.json();
        favoriteBtn.innerText = updatedRecipe.isFavorite ? 'Eliminar de Favoritos' : 'Agregar a Favoritos';
        updateFavoritesList(); // Actualizar la lista de recetas favoritas
    });
}

// Actualizar la lista de recetas favoritas
async function updateFavoritesList() {
    const response = await fetch('/api/recipes/favorites');
    const favorites = await response.json();
    favoritesList.innerHTML = '';
    favorites.forEach(displayFavoriteRecipe);
}

// Mostrar receta favorita
function displayFavoriteRecipe(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
        <h2>${recipe.title}</h2>
        <h4>Ingredientes: ${recipe.ingredients}</h4>
        <p>Preparación: ${recipe.preparation}</p>
        <p>Puntuación promedio: ${recipe.averageRating ? recipe.averageRating.toFixed(1) : 'Sin calificaciones'}</p>
        <button class="favorite-btn" data-id="${recipe._id}">Eliminar de Favoritos</button>
    `;
    favoritesList.appendChild(recipeDiv);

    // Agregar evento para eliminar de favoritos
    const favoriteBtn = recipeDiv.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', async () => {
        const response = await fetch(`/api/recipes/${recipe._id}/favorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const updatedRecipe = await response.json();
        favoritesList.innerHTML = ''; // Limpiar la lista
        updateFavoritesList(); // Actualizar lista de favoritos
    });
}

// Cargar recetas favoritas al cargar la página
window.addEventListener('load', () => {
    updateFavoritesList();
});
