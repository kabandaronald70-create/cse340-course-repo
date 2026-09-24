import bcrypt from 'bcryptjs';
import db from './db.js';

/**
 * Create a new user in the database.
 * Hashes the password before inserting.
 * 
 * @param {string} name - display name
 * @param {string} email - unique login email
 * @param {string} password - plaintext password
 * @param {string} roleName - 'user' or 'admin'
 * @returns {object} the newly created user row (without password_hash)
 */
async function createUser(name, email, password, roleName = 'user') {
    // Hash the password with 10 salt rounds
    const passwordHash = await bcrypt.hash(password, 10);

    // Look up the role_id by role_name (safer than hardcoding 1 or 2)
    const roleResult = await db.query(
        'SELECT role_id FROM roles WHERE role_name = $1',
        [roleName]
    );

    if (roleResult.rows.length === 0) {
        throw new Error(`Role "${roleName}" does not exist`);
    }

    const roleId = roleResult.rows[0].role_id;

    const result = await db.query(
        `INSERT INTO users (name, email, password_hash, role_id)
         VALUES ($1, $2, $3, $4)
         RETURNING user_id, name, email, role_id, created_at`,
        [name, email, passwordHash, roleId]
    );

    return result.rows[0];
}

/**
 * Find a user by email. Returns the row INCLUDING password_hash
 * so the caller can verify the password.
 */
async function findUserByEmail(email) {
    const result = await db.query(
        `SELECT u.user_id, u.name, u.email, u.password_hash,
                u.role_id, r.role_name
         FROM users u
         JOIN roles r ON u.role_id = r.role_id
         WHERE u.email = $1`,
        [email]
    );
    return result.rows[0] || null;
}

/**
 * Find a user by id. Returns row WITHOUT password_hash.
 */
async function findUserById(userId) {
    const result = await db.query(
        `SELECT u.user_id, u.name, u.email,
                u.role_id, r.role_name, u.created_at
         FROM users u
         JOIN roles r ON u.role_id = r.role_id
         WHERE u.user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
}

/**
 * Verify a plaintext password against a stored hash.
 */
async function verifyPassword(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
}

/**
 * Authenticate a user by email + password.
 * Combines findUserByEmail and verifyPassword, and strips the password_hash
 * from the returned object so it never leaks into the session or views.
 * 
 * @returns {object|null} the safe user object, or null on failure
 */
async function authenticateUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) return null;

    // Strip the password_hash before returning
    const { password_hash, ...safeUser } = user;
    return safeUser;
}

export {
    createUser,
    findUserByEmail,
    findUserById,
    verifyPassword,
    authenticateUser
};