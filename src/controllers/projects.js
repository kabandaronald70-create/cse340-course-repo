// src/controllers/projects.js
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Number of upcoming projects to show on the main page
const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        console.log('Upcoming projects:', projects);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            description: 'View the next five upcoming service projects.',
            projects: projects
        });
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        res.status(500).send('Server error');
    }
};

const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.render('project', {
            title: project.title,
            project: project
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Server error');
    }
};

export { showProjectsPage, showProjectDetailsPage };