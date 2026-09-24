import { body, validationResult } from 'express-validator';
import {
    createUser,
    findUserByEmail,
    verifyPassword
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
        const user = await findUserByEmail(email);

        // Same error message whether email is wrong OR password is wrong (don't leak which)
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Save minimal user info in session (never the password hash!)
        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
}

/* ---------- GET /logout ---------- */
function processLogout(req, res) {
    req.session.destroy(err => {
        if (err) console.error('Session destroy error:', err);
        res.redirect('/');
    });
}

export {
    registerValidation,
    loginValidation,
    showRegisterForm,
    processRegister,
    showLoginForm,
    processLogin,
    processLogout
};