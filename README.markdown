## Eat
Eat is a rather boring grid game implemented using various web technologies and positioned using CSS Flexboxes. Users can move a blue square up, down, left, or right in an 8x8 grid, to "eat" green "food" squares. Every square eaten is worth one point, and when a user wants to save their progress, they can enter a username and submit their progress to the server (hopefully this is more entertaining than just entering values into a text field).

If the username is already recorded in the database, then the score associated with the username will be incremented accordingly; otherwise, a new entry will simply associate the username with the existing score. Once the data has been submitted to the server, the user's score is reset to zero, and the user is presented with an updated list of all username/score pairs stored on the server. None of this data is critical, and thus even any long term authentication involving passwords is unnecessary. Bootstrap was chosen as the CSS framework; some minor styling changes (mainly color-scheme related) were layered ontop of Bootstrap to support the application's theme - a down-to-earth pixel game doesn't need a pure white background with blue buttons, but it sure benefits from Bootstrap's robust grid system.

Middleware:

1. `bodyParser` helps when looking at JSON data in HTTP POST requests
2. `cookieParser` is necessary since we are protecting the site from CSRF, which requires cookies
3. `serveStatic` allows us to serve files inside the `public` directory with no additional config
4. `compression` bundles up requests to make them more compact
5. `expressHandlebars` is a templating library that allows us to pass in tokens to be used in CSRF protection
6. `csurf` is the module that protects from CSRF itself
7. The additional function passes in data to the webpage using Handlebars, which allows the token to be accessible

## Technical Achievements
- **HTML5 Canvas Game**: The core "game" functionality is implemented with clientside JavaScript using an HTML5 Canvas, which responds to user input; it is refreshed 20 times every second to show the user the most recent position of both squares.
- **Single Page App with Recent User Updates**: Whenever a user submits their score, the list showing live scores is updated with the latest data from the server. Submitting results triggers an HTTP POST request, and that request returns the database's memory to the client; the live scores list is refreshed with this response data.
- **Modify User Data**: Using application logic, whenever a new user score is submitted to the database, the server checks to see whether a score for the submitted username exists. If it does, then the score for the username is simply updated. With this method, modifying data on the server is possible. Since users can delete their scores, this app implements all aspects of CRUD.
- **Web Frameworks Implemented**: Eat is powered by the VueJS framework, and implements some styles from the Bootstrap CSS framework.

### Design/Evaluation Achievements
N/A
