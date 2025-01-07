# College Cultural Event Website and Admin Panel - KCG Ethereal'23

## Description

This application serves as the platform for KCG Ethereal'23, the annual cultural event of KCG College. It includes features for event and user registrations, team management for eligible events, and QR-based ticketing with various pricing models. A custom payment solution is integrated to process payments, as external gateways like Razorpay could not be used. The admin panel enables event organizers to efficiently manage registrations, generate tickets, and track event performance in real-time.

## Permanent URLs:

- **Official Page for KCG Ethereal events**: [https://kcgethereal.com]
- **Version I developed 2023**: [https://ethereal-81f2e.web.app/] [https://ethereal-81f2e.firebaseapp.com/]

### Features:

#### User Features:

- **User Registration**: Allows users to register for updates, buy tickets and view event details.
- **Event Registration**: Users can register for specific events. Users can join existing teams if the team belongs to the same college.
- **Team Management**: Allows managing teams for events with multiple participants. The team lead can kick out any existing team member. Team eligibility check is on to know if a user is paid for the event.
- **QR-based Ticketing**: Generates QR codes for tickets with varying pricing models.
- **Custom Payment Solution**: A custom-built payment solution due to restrictions with external payment gateways.

#### Admin Panel Features:

- **On-the-Spot Ticketing**: Admins can generate tickets directly from the admin panel.
- **Event Registration Management**: Admins can track the number of registrations per event in real-time.
- **Amount Generation**: Admins can calculate the total amount generated from event registrations and ticket sales.
- **User Management**: New users can be created from the admin panel during on-spot registrations.
- **Event Performance Dashboard**: Provides insights into event registrations, ticket sales, and overall performance metrics.
- **Payments Pause/Resume**: Admin can pause and resume the payments.

## Tech Stack

- **Frontend**: React JS
- **Backend**: Node JS + Express JS
- **Hosting**:
  - **Frontend**: Firebase Hosting
  - **Backend**: Google App Engine
- **Database**: PostgreSQL (Render)

## Development Prerequisites:

- Node.js (v14 or above)
- Postgresql

## Local Setup

#### Frontend

In the `cur-frontend/ethereal23-frontend/data.js` file, update the `baseUrl` to the local backend URl. It should look something like this:

```js
export const baseURL = "http://localhost:8000"; // Your backend url
```

Run the following commands to install the required node modules and star the frontend server locally.

```bash
cd cur-frontend/ethereal23-frontend
npm install
npm run dev
```

#### Backend

Create a database in postgresql

In `index.js` find the postgresql client creation and update it with your details. It should look something like this:

```js
const client = new Client({
  host: "localhost",
  password: "password", // Your db password
  database: "ethereal", // Your db name
  port: 5432, // Your db port
  user: "postgres", // Your db username
});
```

Note: For cloud database use the connection string by setting it up in the .env file

Run all the create table queries in the `ethereal23-backend/queries.sql` file.

Run the below commands to install the node modules and to start the server locally

```bash
cd cur-frontend/ethereal23-frontend
npm install
node index.js
```
