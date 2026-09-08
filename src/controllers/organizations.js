import { getOrganizationById } from '../models/organizations.js';

const showOrganizationDetailsPage = async (req, res) => {
    try {
        const orgId = req.params.id;
        const organization = await getOrganizationById(orgId);
        if (!organization) {
            return res.status(404).send('Organization not found');
        }
        res.render('organization', {
            title: organization.name,
            organization: organization
        });
    } catch (error) {
        console.error('Error fetching organization details:', error);
        res.status(500).send('Server error');
    }
};

export { showOrganizationDetailsPage };