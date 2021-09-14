## A3-Matthew7758

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me
[Heroku App Link](https://a3-matthew7758.herokuapp.com/)
[Glitch App Link](https://a3-matthew7758.glitch.me)


The goal of this application is to design a more in-depth census tracker that I made in project a2. This one uses MongoDB to store data persistently. It also has login support with Bcrypt.
Challenges I faced were mainly in learning CSS to make the page look nice and getting the authentication posts to run correctly. I've done security before, but front end development is often a difficult task for me.
Now only authenticated users can create data and view their own data.
The authentication strategy I chose to implement was a simple one using Bcrypt and MongoDB to store usernames and passwords. I used a salt to prevent against rainbow attacks and brute force. I chose this because it seemed easier to implement and provided some sense of security for the user.


1. Helmet: Helps secure app by setting http headers automatically.
2. Morgan: Enables verbose logging for all HTTP requests. Used for debugging.
3. serve-static: Allows server to serve files in the public directory.
4. serve-favicon: Serves favicon.
5. Cors: Allows cross-origin requests so data can be retrieved from non-local users.

## Technical Achievements
- **Tech Achievement 1**: I used BCrypt to encrypt user passwords to store them into the database instead of plaintext.
- **Tech Achievement 2**: I set up custom routes for MongoDB and used Mongoose to create "schemas" to facilitate proper data entry.
- **Tech Achievement 3**: I deployed the server to Heroku at https://a3-matthew7758.herokuapp.com/
- **Tech Achievement 4**: I designed a custom login framework using BCrypt and MongoDB to authenticate users before data entry and before loading any results. Basic cookies are used with an authentication token that expires after approximately one day.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
  1. I updated the page title to show that it is for the CS4241 Assignment 3
  2. I used headings and subheadings on both the login page and main index page to indicate importance of information.
  3. I edited links to make them informative and fit into sentences in the index.html page.
  4. Added alt tags to image to give them alternate information when used on screen readers.
  5. Added clear instructions when creating a new user on password requirements.
  6. Added warning popups when incorrect user information is entered for logins.
  7. Added clear concise icons to easily edit or remove entries in the database.
  8. Provided enough contrast of background and text.
  9. Ensured form elements are properly labeled and are placed next to labels.
  10. Used spacing on index.html to properly space content and forms.
  11. Identified page language in metadata.
  12. Reflect reading order in code order: Made sure all images and text were properly placed and aligned/positioned so content isn't lost.