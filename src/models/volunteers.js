import db from './db.js';

/**
 * Add a user as a volunteer for a project.
 * Uses ON CONFLICT DO NOTHING so clicking "volunteer" twice doesn't error.
 */
async function addVolunteer(userId, projectId) {
    await db.query(
        `INSERT INTO volunteers (user_id, project_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, project_id) DO NOTHING`,
        [userId, projectId]
    );
}

/**
 * Remove a user as a volunteer for a project.
 * No error if the row didn't exist.
 */
async function removeVolunteer(userId, projectId) {
    await db.query(
        `DELETE FROM volunteers
         WHERE user_id = $1 AND project_id = $2`,
        [userId, projectId]
    );
}

/**
 * Check if a user is currently a volunteer for a project.
 * Returns true or false.
 */
async function isVolunteer(userId, projectId) {
    const result = await db.query(
        `SELECT 1 FROM volunteers
         WHERE user_id = $1 AND project_id = $2`,
        [userId, projectId]
    );
    return result.rows.length > 0;
}

/**
 * Get all projects a user has volunteered for.
 * Returns project details + organization name + volunteered_at.
 */
async function getVolunteeredProjects(userId) {
    const result = await db.query(
        `SELECT p.project_id, p.title, p.description, p.location, p.project_date,
                o.name AS organization_name,
                v.volunteered_at
         FROM volunteers v
         JOIN service_projects p ON v.project_id = p.project_id
         JOIN organization o ON p.organization_id = o.organization_id
         WHERE v.user_id = $1
         ORDER BY v.volunteered_at DESC`,
        [userId]
    );
    return result.rows;
}

export {
    addVolunteer,
    removeVolunteer,
    isVolunteer,
    getVolunteeredProjects
};