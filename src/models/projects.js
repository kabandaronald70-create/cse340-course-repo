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

// Export – add the new function to the list
export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId };
