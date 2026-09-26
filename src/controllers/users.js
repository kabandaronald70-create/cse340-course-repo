import { body, validationResult } from 'express-validator';
import {
    createUser,
    findUserByEmail,
    authenticateUser
} from '../models/users.js';

/* ---------- Validation rules ---------- */
const registerValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be 2–100 characters.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters.')
];

const loginValidation = [
    body('email').trim().isEmail().withMessage('Invalid email.'),
    body('password').notEmpty().withMessage('Password is required.')
];

/* ---------- GET /register ---------- */
function showRegisterForm(req, res) {
    res.render('register', { title: 'Register', description: 'Create a new CSE 340 Service Network account.' });
}

/* ---------- POST /register ---------- */
async function processRegister(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(e => req.flash('error', e.msg));
            return res.redirect('/register');
        }

        const { name, email, password } = req.body;

        // Prevent duplicate email
        const existing = await findUserByEmail(email);
        if (existing) {
            req.flash('error', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        const user = await createUser(name, email, password, 'user');

        req.flash('success', 'Account created! Please log in.');
        res.redirect('/login');
    } catch (err) {
        next(err);
    }
}

/* ---------- GET /login ---------- */
function showLoginForm(req, res) {
    res.render('login', { title: 'Login', description: 'Sign in to your CSE 340 Service Network account.' });
}

/* ---------- POST /login ---------- */
async function processLogin(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(e => req.flash('error', e.msg));
            return res.redirect('/login');
        }

        const { email, password } = req.body;

        // Single call to authenticateUser — does lookup + verify + strip hash
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;

        console.log(`User logged in: ${user.email} (role: ${user.role_name})`);

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');  
    } catch (err) {
        next(err);
    }
}

/* ---------- GET /logout ---------- */
function processLogout(req, res, next) {
    req.session.regenerate(err => {
        if (err) return next(err);

        req.flash('success', 'You have been logged out.');
        res.redirect('/login');
    });
}

/* ---------- GET /dashboard ---------- */
function showDashboard(req, res) {
    const { name, email } = req.session.user;
    res.render('dashboard', {
        title: 'Dashboard',
        description: 'Your personal CSE 340 Service Network dashboard.',
        name,
        email
    });
}
export {
    registerValidation,
    loginValidation,
    showRegisterForm,
    processRegister,
    showLoginForm,
    processLogin,
    processLogout,
    showDashboard
};
export { requireLogin } from '../middleware/auth.js';
export { requireRole } from '../middleware/auth.js';