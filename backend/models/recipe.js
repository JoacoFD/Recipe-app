const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: String, required: true },
    preparation: { type: String, required: true },
    ratings: { type: [Number], default: [] } // Almacena las calificaciones
});

module.exports = mongoose.model('Recipe', recipeSchema);
