# CampusHub

CampusHub is a static university community dashboard for students, alumni, and administrators.

## Run locally

The authentication page loads the initial accounts from `users.json`, so serve the project over HTTP instead of opening `auth.html` directly from the file system.


## Login accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@premier.edu` | `student123` |
| Alumni | `alumni@premier.edu` | `alumni123` |
| Admin | `admin@premier.edu` | `admin123` |

These are development/demo accounts only. The project currently stores users and the active session in browser `localStorage`; do not use these credentials or this authentication approach in production.
