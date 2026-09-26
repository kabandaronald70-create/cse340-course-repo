import {
    addVolunteer,
    removeVolunteer
} from '../models/volunteers.js';

/* ---------- POST /volunteer/:projectId ---------- */
async function processVolunteerForProject(req, res, next) {
    try {
        const userId = req.session.user.user_id;
        const projectId = parseInt(req.params.projectId, 10);

        if (isNaN(projectId)) {
            req.flash('error', 'Invalid project.');
            return res.redirect('/projects');
        }

        await addVolunteer(userId, projectId);

        req.flash('success', 'You are now signed up as a volunteer!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
}

/* ---------- POST /unvolunteer/:projectId ---------- */
async function processRemoveVolunteer(req, res, next) {
    try {
        const userId = req.session.user.user_id;
        const projectId = parseInt(req.params.projectId, 10);

        if (isNaN(projectId)) {
            req.flash('error', 'Invalid project.');
            return res.redirect('/projects');
        }

        await removeVolunteer(userId, projectId);

        // Send them back to the page they came from
        const referer = req.get('Referer') || '/dashboard';
        req.flash('success', 'You have been removed as a volunteer.');
        res.redirect(referer);
    } catch (err) {
        next(err);
    }
}

export { processVolunteerForProject, processRemoveVolunteer };