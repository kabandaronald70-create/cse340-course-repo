// src/models/projects.js
import db from './db.js';

/**
 * Get all projects (used for reference, but we'll use upcoming for the main page)
 */
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM service_projects p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get the next `limit` upcoming projects (date >= today, ordered by date)
 */
const getUpcomingProjects = async (limit) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM service_projects p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
};

/**
 * Get a single project by its ID, including the organization name
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM service_projects p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0]; // return the first row (or undefined if not found)
};

/**
 * Get projects associated with a specific organization
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, title, description, location, project_date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

/**
 * Creates a new service project in the database.
 * @param {string} title
 * @param {string} description
 * @param {string} location
 * @param {string} date
 * @param {number} organizationId
 * @returns {string} The id of the newly created project.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_projects (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

/**
 * Updates an existing service project in the database.
 * @param {number} projectId
 * @param {string} title
 * @param {string} description
 * @param {string} location
 * @param {string} date
 * @param {number} organizationId
 * @returns {string} The id of the updated project.
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_projects
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

// Export – add the new function to the list
export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, createProject, updateProject };
