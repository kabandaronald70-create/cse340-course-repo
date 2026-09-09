import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    const description = 'Meet the partner organizations working with the CSE 340 Service Network to strengthen communities.';
    res.render('organizations', { title, description, organizations });
};

const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationById(organizationId);

    if (!organization) {
        const err = new Error('Organization not found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const title = organization.name;
    const description = organization.description;   

    res.render('organization', { 
        title, 
        description, 
        organization,   
        projects 
    });
};

export { showOrganizationsPage, showOrganizationDetailsPage };