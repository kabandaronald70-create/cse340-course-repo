import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { getAllOrganizations } from './src/models/organizations.js';
import { testConnection } from './src/models/db.js';
import { getAllCategories } from './src/models/categories.js';
import router from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Custom middleware
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Mount project routes
app.use('/', router);

// Other routes (home, organizations, categories)
app.get('/', async (req, res) => {
    res.render('home', {
        title: 'Home',
        description: 'Connect with volunteers and discover service opportunities through the CSE 340 Service Network.'
    });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Partner Organizations',
            description: 'Meet the partner organizations working with the CSE 340 Service Network to strengthen communities.',
            organizations: organizations
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', {
            title: 'Project Categories',
            description: 'Browse service project categories.',
            categories: categories
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});