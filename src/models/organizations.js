import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getOrganizationById = async (id) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0]; // undefined if not found
};

export { getAllOrganizations, getOrganizationById };