import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { testConnection } from './src/models/db.js';
import { getAllCategories } from './src/models/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});
// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * Routes
 */
app.get('/', async (req, res) => {
  res.render('home', {
    title: 'Home',
    description: 'Connect with volunteers and discover service opportunities through the CSE 340 Service Network.'
  });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    const description = 'Meet the partner organizations working with the CSE 340 Service Network to strengthen communities.';
    try {
        const organizations = await getAllOrganizations();
        console.log('Organizations from DB:', organizations);
        res.render('organizations', { title, description, organizations: organizations || [] });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.render('organizations', { title, description, organizations: [], error: error.message });
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        console.log('Projects data:', projects); // for debugging
        res.render('projects', {
            title: 'Service Projects',
            description: 'Explore upcoming service projects, including park cleanups, food drives, and community tutoring.',
            projects: projects   // pass the projects array to the view
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        console.log('Categories data:', categories);
        res.render('categories', {
            title: 'Project Categories',
            description: 'Browse service project categories such as environmental, educational, community, and health initiatives.',
            categories: categories
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});