# Visited Countries Tracker

This is a Node.js web application that lets users track countries they have visited. The application integrates with a PostgreSQL database to store and manage user data, visited countries, and supports multiple users with personalized themes.

## Features

- Add countries to the list of visited countries.
- Track the total number of countries visited.
- Switch between users and view their visited countries.
- Add new users with customizable themes (colors).
- Dynamic and responsive UI using EJS templates.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd visited-countries-tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the PostgreSQL database:
   - Create a database and tables with the following structure:

     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       color VARCHAR(50) NOT NULL
     );

     CREATE TABLE countries (
       id SERIAL PRIMARY KEY,
       country_name VARCHAR(255) NOT NULL,
       country_code VARCHAR(10) NOT NULL UNIQUE
     );

     CREATE TABLE visited_countries (
       id SERIAL PRIMARY KEY,
       user_id INT REFERENCES users(id),
       country_code VARCHAR(10) REFERENCES countries(country_code)
     );
     ```

5. (Optional) Populate the `countries` table with data:
   ```sql
   INSERT INTO countries (country_name, country_code) VALUES
   ('United States', 'US'),
   ('Canada', 'CA'),
   ('Mexico', 'MX');
   ```

6. Update the database connection details in the application:
   Replace the placeholder values in the following code in `app.js`:

   ```javascript
   const db = new pg.Client({
     user: "postgres",
     host: "localhost",
     database: "The World",
     password: "your_password",
     port: 5432,
   });
   ```

## Running the Application

1. Start the PostgreSQL server.

2. Start the Node.js application:

   ```bash
   node app.js
   ```

3. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

## Application Workflow

### 1. Routes Overview

#### `GET /`
- Renders the homepage showing:
  - The list of countries visited by the current user.
  - Total number of visited countries.
  - Dropdown to switch between users.

#### `POST /add`
- Adds a country to the current user's list of visited countries.
- Input: Country name (case-insensitive).
- Validates the country against the `countries` table.

#### `POST /user`
- Handles user selection from the dropdown menu.
- Supports adding a new user by redirecting to a user creation form.

#### `POST /new`
- Adds a new user to the database with a name and a chosen theme color.
- Redirects back to the homepage.

### 2. Database Structure

| Table               | Columns                                 |
|---------------------|-----------------------------------------|
| `users`             | `id`, `name`, `color`                  |
| `countries`         | `id`, `country_name`, `country_code`   |
| `visited_countries` | `id`, `user_id`, `country_code`         |

### 3. Dynamic Behavior

- The current user's visited countries and theme are dynamically fetched from the database and displayed.
- The dropdown menu allows switching between users, with the UI updating accordingly.

## Example Usage

### Add a Visited Country

1. Enter a country name in the input field (e.g., "Canada").
2. Click the "Add" button.
3. The country will appear in the list, and the total count will update.

### Switch Users

1. Select a user from the dropdown menu.
2. Click "Switch" to view the selected user's data.

### Add a New User

1. Select "Add New User" from the dropdown menu.
2. Fill in the name and choose a theme color.
3. Submit the form to create the user and return to the homepage.

## Dependencies

- `express`: Web framework.
- `body-parser`: Parses incoming requests.
- `pg`: PostgreSQL client for Node.js.
- `ejs`: Template engine for dynamic HTML rendering.

