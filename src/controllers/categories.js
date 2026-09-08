// src/controllers/categories.js
import { getAllCategories } from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    const description = 'Browse service project categories.';
    res.render('categories', { title, description, categories });
};

export { showCategoriesPage };