-- ============================================
-- CSE 340 Service Network — setup.sql
-- Run this top-to-bottom against an empty database
-- to rebuild the entire schema + seed data.
-- ============================================

-- --------------------------------------------
-- 1. DROP EXISTING TABLES (children first)
-- --------------------------------------------
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS service_projects CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS organization CASCADE;


-- ============================================
-- 2. ORGANIZATION + SERVICE_PROJECTS
-- ============================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
    ('BrightFuture Builders',
     'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
     'info@brightfuturebuilders.org',
     'brightfuture-logo.png'),
    ('GreenHarvest Growers',
     'An urban farming collective promoting food sustainability and education in local neighborhoods.',
     'contact@greenharvest.org',
     'greenharvest-logo.png'),
    ('UnityServe Volunteers',
     'A volunteer coordination group supporting local charities and service initiatives.',
     'hello@unityserve.org',
     'unityserve-logo.png');


CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id) ON DELETE CASCADE
);

-- BrightFuture Builders (organization_id = 1)
INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
    (1, 'Community Park Renovation',
        'Renovate the old community park with new playground equipment and picnic areas.',
        'Central Park, Springfield', '2026-10-15'),
    (1, 'Affordable Housing Build',
        'Help construct 5 new affordable homes for low-income families.',
        'Elm Street, Springfield', '2026-11-01'),
    (1, 'School Playground Upgrade',
        'Build a new accessible playground at Lincoln Elementary School.',
        'Lincoln Elementary, Springfield', '2026-09-20'),
    (1, 'Senior Center Garden',
        'Create a community garden at the senior center for residents to enjoy.',
        'Senior Center, Springfield', '2026-08-10'),
    (1, 'Downtown Sidewalk Repair',
        'Repair broken sidewalks and add ramps for better accessibility.',
        'Downtown Springfield', '2026-10-05');

-- GreenHarvest Growers (organization_id = 2)
INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
    (2, 'Urban Farm Expansion',
        'Expand the urban farm by adding 10 new raised beds and a greenhouse.',
        'GreenHarvest Farm, Metropolis', '2026-07-20'),
    (2, 'Community Cooking Class',
        'Teach healthy cooking classes using produce from the farm.',
        'Community Center, Metropolis', '2026-08-15'),
    (2, 'Seed Distribution Drive',
        'Distribute free vegetable seeds to families in food deserts.',
        'Various locations, Metropolis', '2026-09-01'),
    (2, 'Farmers Market Setup',
        'Organize a weekly farmers market in the downtown plaza.',
        'Downtown Plaza, Metropolis', '2026-10-10'),
    (2, 'School Garden Workshop',
        'Show students how to start and maintain a school vegetable garden.',
        'Washington High, Metropolis', '2026-09-25');

-- UnityServe Volunteers (organization_id = 3)
INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
    (3, 'Food Drive for Holidays',
        'Collect and distribute food boxes to families in need during the holiday season.',
        'City Hall, Unity', '2026-12-01'),
    (3, 'Blood Donation Camp',
        'Organise a blood donation camp in partnership with the Red Cross.',
        'Community Hall, Unity', '2026-10-20'),
    (3, 'Clothing Swap Event',
        'Host a clothing swap to promote sustainable fashion and help those in need.',
        'Unity Center, Unity', '2026-11-15'),
    (3, 'Neighborhood Cleanup',
        'Coordinate a large-scale cleanup of the Riverside neighborhood.',
        'Riverside Park, Unity', '2026-09-05'),
    (3, 'Pet Adoption Fair',
        'Partner with animal shelters to host a pet adoption and vaccination fair.',
        'Unity Fairgrounds, Unity', '2026-08-25');


-- ============================================
-- 3. CATEGORY + PROJECT_CATEGORY (many-to-many)
-- ============================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Community Outreach'),
    ('Education'),
    ('Health & Wellness'),
    ('Infrastructure');

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 1), (1, 2),
    (2, 5), (2, 2),
    (3, 3), (3, 2),
    (4, 1), (4, 4),
    (5, 5), (5, 2),
    (6, 1), (6, 3),
    (7, 4), (7, 3),
    (8, 1), (8, 2),
    (9, 2), (9, 4),
    (10, 3), (10, 1),
    (11, 2), (11, 4),
    (12, 4), (12, 2),
    (13, 2), (13, 1),
    (14, 1), (14, 2),
    (15, 4), (15, 2);


-- ============================================
-- 4. ROLES + USERS
-- ============================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 5. VOLUNTEERS (many-to-many users ↔ projects)
-- ============================================

CREATE TABLE volunteers (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES service_projects(project_id) ON DELETE CASCADE,
    volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id)
);