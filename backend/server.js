const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Importa el módulo path
const Recipe = require('./models/recipe');
const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/recipe-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('No se pudo conectar a MongoDB', err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Cambia a ruta absoluta con path

// Rutas API
// Agregar nueva receta
app.post('/api/recipes', async (req, res) => {
    const { title, ingredients, preparation } = req.body;
    const recipe = new Recipe({ title, ingredients, preparation, ratings: [], isFavorite: false }); // Agregar isFavorite
    try {
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        res.status(400).send({ message: 'Error al agregar receta', error });
    }
});

// Buscar recetas
app.get('/api/recipes', async (req, res) => {
    const { search } = req.query;
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    try {
        const recipes = await Recipe.find(filter);
        res.send(recipes);
    } catch (error) {
        res.status(500).send({ message: 'Error al cargar recetas', error });
    }
});

// Calificar receta
app.post('/api/recipes/:id/rating', async (req, res) => {
    const { rating } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            recipe.ratings.push(rating);
            await recipe.save();
            const averageRating = recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length; // Calcular el promedio
            res.send({ ...recipe._doc, averageRating }); // Devolver receta con el promedio
        } else {
            res.status(404).send({ message: 'Receta no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar puntuación', error });
    }
});

// Marcar receta como favorita
app.post('/api/recipes/:id/favorite', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            recipe.isFavorite = !recipe.isFavorite; // Alternar estado
            await recipe.save();
            res.send(recipe);
        } else {
            res.status(404).send({ message: 'Receta no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error al marcar como favorito', error });
    }
});

// Obtener recetas favoritas
app.get('/api/recipes/favorites', async (req, res) => {
    try {
        const favorites = await Recipe.find({ isFavorite: true });
        res.send(favorites);
    } catch (error) {
        res.status(500).send({ message: 'Error al cargar recetas favoritas', error });
    }
});

// Eliminar receta por ID
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).send({ message: 'Receta no encontrada' });
        }
        res.send({ message: 'Receta eliminada con éxito' });
    } catch (error) {
        res.status(500).send({ message: 'Error al eliminar la receta', error });
    }
});

// Ruta para manejar cualquier otra solicitud y redirigir al archivo index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
