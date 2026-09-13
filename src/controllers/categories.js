import { getAllCategories, getCategoryById, getProjectsForCategory, getCategoriesForProject, updateCategoryAssignments,  createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator'; 

// Validation rules for the category form (shared by create + edit)
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

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

const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    if (!projectDetails) {
        const err = new Error('Project not found');
        err.status = 404;
        return next(err);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesForProject(projectId);

    const title = 'Assign Categories to Project';
    const description = `Assign categories to ${projectDetails.title}`;

    res.render('assign-categories', {
        title,
        description,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure it's always an array (single checkbox → string; none → undefined)
    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    const description = 'Create a new category for service projects.';

    res.render('new-category', { title, description });
};

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    await createCategory(name);

    req.flash('success', 'Category added successfully!');
    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);

    if (!categoryDetails) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Category';
    const description = `Edit the name of ${categoryDetails.name}`;

    res.render('edit-category', { title, description, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

export { showCategoriesPage, showCategoryDetailsPage, updateCategoryAssignments, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };