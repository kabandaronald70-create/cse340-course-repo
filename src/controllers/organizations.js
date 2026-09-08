// src/controllers/organizations.js
import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    const description = 'Meet the partner organizations working with the CSE 340 Service Network to strengthen communities.';
    res.render('organizations', { title, description, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const orgId = req.params.id;
    const organization = await getOrganizationById(orgId);
    if (!organization) {
        const err = new Error('Organization not found');
        err.status = 404;
        return req.next(err);
    }
    const title = organization.name;
    res.render('organization', { title, organization });
};

export { showOrganizationsPage, showOrganizationDetailsPage };