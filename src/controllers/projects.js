// src/controllers/projects.js
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    const description = 'View the next five upcoming service projects.';
    res.render('projects', { title, description, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    if (!project) {
        const err = new Error('Project not found');
        err.status = 404;
        return next(err);
    }
    const title = project.title;
    res.render('project', { title, project });
};

export { showProjectsPage, showProjectDetailsPage };