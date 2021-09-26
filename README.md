# Assignment 3 - Matthew Spofford

<https://cs4241-a3-MatthewSpofford.herokuapp.com>

# Homework Agenda

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

**Express Middleware**:

- Express.static()
- Body-parser
- Cookie-parser
- PassportJS (OAuth2)
- CORS = Used to remove Same Origin Policy errors when redirecting to GitHub for OAuth.
- Custom MongoDB Middleware = determines if mongodb server could not establish a connection, and then outputs a 503 error code if it is
- Custom Redirect Middleware = Redirect to home page if a user is not logged in (determined by if a cookie exists) and is attempting to view their agenda


## Technical Achievements

- **Setup OAuth for Login**:
- **Using Heroku for Hosting**: Seems to have no downtime for starting 

### Design Achievements
