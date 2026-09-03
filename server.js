import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

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

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
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
  res.render('organizations', {
    title: 'Partner Organizations',
    description: 'Meet the partner organizations working with the CSE 340 Service Network to strengthen communities.'
  });
});

app.get('/projects', async (req, res) => {
  res.render('projects', {
    title: 'Service Projects',
    description: 'Explore upcoming service projects, including park cleanups, food drives, and community tutoring.'
  });
});

app.get('/categories', (req, res) => {
  res.render('categories', {
    title: 'Project Categories',
    description: 'Browse service project categories such as environmental, educational, community, and health initiatives.'
  });
});