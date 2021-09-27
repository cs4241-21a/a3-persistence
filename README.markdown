Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Homework Tracker

Glitch link: https://a3-victoria-grasso.glitch.me/

- The goal of the application was to keep track of Homework Assignments. To add an assignment, the user would fill out the class and assignment fields, select if the assignment was completed, select a due date, and click the submit button. To delete an assignment, the user would type in the class and assignment fields and click the delete button. Note: I assumed the user would only enter a unique class and assignment.
- The challenges I faced included learning the syntax for mongodb and how to query from the database. I set up my database to be One-to-Few which proved challenging to create the modify function.
- For authentication, I chose to use a login.html page cookies to check user authentication and login. I did what was suggested and if a user is not already established, it is automatically created. I did this because it seemed the easiest to implement.
- I used the milligram CSS framework because it was simple and clean in its appearance. https://milligram.io/
  - I did not make any modifications to the milligram framework.
- The middleware I used were: *cookie-session* which establishes cookie-based sessions (I used this for login), *body-parser* which parses HTTP request body, *express-slash* which handles routes with and without trailing slashes, *response-time* which records HTTP response time, and *compression* which compresses HTTP responses. https://expressjs.com/en/resources/middleware.html

## Technical Achievements
- **Tech Achievement 1**: I got 100% in all four lighthouse tests required for this assignment.

