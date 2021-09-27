# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

\_Due: September 20th, by 11:59 AM.

## GTWFin

http://a3-gtwfam.glitch.me

This web application:

- Helps people to keep track of their financial inflow and outflow.
- Had challenges like server communication with the front end, equality of objects, and more.
- Uses Passport JS as authentication strategy since it's an easy middleware to enable with Express JS
- Styled mainly with Bootstrap 5.1 plus some animation with tranforms
- Uses middlewares:
  1. PassportJS (Local): Authenticates the user by username and password
  2. express-flash: Creates error messages from passport js failed logins
  3. express-session: saves the user's login for page reloads
  4. method-override: overrides HTTP method with a specified header
  5. checkNotAuthenticated, checkAuthenticated: Ensures that only authenticated users can reach the content of the application

## Technical Achievements

- **Tech Achievement 1**:
  - Used OAuth authentication with Passport JS Local with mongoDB

### Design/Evaluation Achievements

- **Design Achievement 1**:
  - The website follows the CRAP principles:
    C. The overall style of the page is bright. The website's background is white, and the content has bright colors, like blue, red, and green. Although, the colors are a little bit saturated for the black text to be visible. On the other hand, the buttons have a highly saturated and a little darker blue color. Therefore, the white-colored text would make more sense for legibility.
    R. The website uses the same styling across all the pages: the blue buttons with white text, the same size forms' inputs, and the same table design for all tabs on the dashboard. The webpage uses repetition to the fonts, sizing, and spacing to ensure the consistency of the page. Moreover, it helps the navigation flow as a user goes through it. Consistent design of pages makes the pages identify with the app.
    A. Every single element of the website has an accurate position. The login and register pages have the forms in the middle of the page, so they attract the user's attention. On the dashboard page, the log out button is in the top right corner, whereas the main content is in the middle of the whole page. Thus, the page creates an interactive form that engages the user with the main content first.
    P. The inputs for the form are close to each other, which makes it clear that they relate to one submission. The spacing of the tabs shows the continuation of the months in a year, and the table columns and rows have equal spacing for the user's ease in identifying columns and rows for each table entry.
