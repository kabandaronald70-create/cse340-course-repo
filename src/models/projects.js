// src/models/projects.js
import db from './db.js';

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
        ORDER BY p.project_date DESC;
    `;
    const result = await db.query(query);
    return result.rows;
};

export { getAllProjects };