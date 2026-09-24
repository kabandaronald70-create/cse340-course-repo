// src/routes.js
import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm,  processNewOrganizationForm,organizationValidation,  showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage,  showNewProjectForm, processNewProjectForm,  projectValidation,   showEditProjectForm,     
    processEditProjectForm } from './controllers/projects.js';
import {
    showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm,showNewCategoryForm, processNewCategoryForm, showEditCategoryForm,      processEditCategoryForm,categoryValidation } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import {
    registerValidation, loginValidation, showRegisterForm, processRegister, showLoginForm, processLogin, processLogout,  showDashboard,
    requireLogin
} from './controllers/users.js';
import { requireAdmin } from './middleware/auth.js';
import { showAdminDashboard } from './controllers/admin.js';

const router = express.Router();


// Main pages
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/register', showRegisterForm);
router.post('/register', registerValidation, processRegister);
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);
router.get('/admin', requireAdmin, showAdminDashboard);

router.get('/dashboard', requireLogin, showDashboard);


// Route to handle the submission of the edit organization form
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Details pages
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);   
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);
// Error test
router.get('/test-error', testErrorPage);

export default router;