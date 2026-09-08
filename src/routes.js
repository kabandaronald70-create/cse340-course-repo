// src/routes.js
import express from 'express';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js'; 

const router = express.Router();

// Main projects page – shows upcoming projects
router.get('/projects', showProjectsPage);

// Single project details page
router.get('/project/:id', showProjectDetailsPage);

router.get('/organization/:id', showOrganizationDetailsPage);

export default router;