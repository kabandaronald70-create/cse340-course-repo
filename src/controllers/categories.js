import { getAllCategories, getCategoryById, getProjectsForCategory } from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    const description = 'Browse service project categories.';
    res.render('categories', { title, description, categories });
};

//  Category details page
const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    if (!category) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }
    const projects = await getProjectsForCategory(categoryId);
    const title = category.name;
    const description = `Service projects in the "${category.name}" category.`;
    res.render('category', { title, description, category, projects });
};

export { showCategoriesPage, showCategoryDetailsPage };