/**
 * Middleware to make the logged-in user available in res.locals
 * (so all EJS templates can access `user` without passing it in every route).
 * 
 * Attach this AFTER session middleware in server.js.
 */
function setCurrentUser(req, res, next) {
    res.locals.user = req.session.user || null;
    res.locals.isLoggedIn = !!req.session.user;
    next();
}

/**
 * Require the user to be logged in. Redirects to /login if not.
 */
function requireLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
}

/**
 * Require the user to be logged in AS AN ADMIN.
 */
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    if (req.session.user.role_name !== 'admin') {
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/');
    }
    next();
}

export { setCurrentUser, requireLogin, requireAdmin };