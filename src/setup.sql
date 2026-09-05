CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );
--PROJECTS TABLE
-- Drop existing table if you want to re‑create (optional)
DROP TABLE IF EXISTS service_projects CASCADE;
-- Create the service_projects table
CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);
-- Insert sample projects for each organization
-- BrightFuture Builders (organization_id = 1)
INSERT INTO service_projects (
        organization_id,
        title,
        description,
        location,
        project_date
    )
VALUES (
        1,
        'Community Park Renovation',
        'Renovate the old community park with new playground equipment and picnic areas.',
        'Central Park, Springfield',
        '2026-10-15'
    ),
    (
        1,
        'Affordable Housing Build',
        'Help construct 5 new affordable homes for low‑income families.',
        'Elm Street, Springfield',
        '2026-11-01'
    ),
    (
        1,
        'School Playground Upgrade',
        'Build a new accessible playground at Lincoln Elementary School.',
        'Lincoln Elementary, Springfield',
        '2026-09-20'
    ),
    (
        1,
        'Senior Center Garden',
        'Create a community garden at the senior center for residents to enjoy.',
        'Senior Center, Springfield',
        '2026-08-10'
    ),
    (
        1,
        'Downtown Sidewalk Repair',
        'Repair broken sidewalks and add ramps for better accessibility.',
        'Downtown Springfield',
        '2026-10-05'
    );
-- GreenHarvest Growers (organization_id = 2)
INSERT INTO service_projects (
        organization_id,
        title,
        description,
        location,
        project_date
    )
VALUES (
        2,
        'Urban Farm Expansion',
        'Expand the urban farm by adding 10 new raised beds and a greenhouse.',
        'GreenHarvest Farm, Metropolis',
        '2026-07-20'
    ),
    (
        2,
        'Community Cooking Class',
        'Teach healthy cooking classes using produce from the farm.',
        'Community Center, Metropolis',
        '2026-08-15'
    ),
    (
        2,
        'Seed Distribution Drive',
        'Distribute free vegetable seeds to families in food deserts.',
        'Various locations, Metropolis',
        '2026-09-01'
    ),
    (
        2,
        'Farmers Market Setup',
        'Organize a weekly farmers market in the downtown plaza.',
        'Downtown Plaza, Metropolis',
        '2026-10-10'
    ),
    (
        2,
        'School Garden Workshop',
        'Show students how to start and maintain a school vegetable garden.',
        'Washington High, Metropolis',
        '2026-09-25'
    );
-- UnityServe Volunteers (organization_id = 3)
INSERT INTO service_projects (
        organization_id,
        title,
        description,
        location,
        project_date
    )
VALUES (
        3,
        'Food Drive for Holidays',
        'Collect and distribute food boxes to families in need during the holiday season.',
        'City Hall, Unity',
        '2026-12-01'
    ),
    (
        3,
        'Blood Donation Camp',
        'Organise a blood donation camp in partnership with the Red Cross.',
        'Community Hall, Unity',
        '2026-10-20'
    ),
    (
        3,
        'Clothing Swap Event',
        'Host a clothing swap to promote sustainable fashion and help those in need.',
        'Unity Center, Unity',
        '2026-11-15'
    ),
    (
        3,
        'Neighborhood Cleanup',
        'Coordinate a large‑scale cleanup of the Riverside neighborhood.',
        'Riverside Park, Unity',
        '2026-09-05'
    ),
    (
        3,
        'Pet Adoption Fair',
        'Partner with animal shelters to host a pet adoption and vaccination fair.',
        'Unity Fairgrounds, Unity',
        '2026-08-25'
    );