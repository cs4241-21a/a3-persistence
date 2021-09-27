Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Your Web Application Title

[https://a3-felchen.glitch.me/login.html](https://a3-felchen.glitch.me/login.html)


- The goal of the application is to allow the user to manage a collection of different materials and view various properties about the materials such as mass and volume, and some server calculated values like density
- The project is incomplete, as there is no way to view each user's collection of materials other than some json that is printed to console. There is also no way to edit or delete entries in the database, and only adding new entries is possible.
- I used a very simple authentication strategy of checking the database for the user's username password combo and creating a new user and password combo if the user entered a username that didn't exist in the database before. The login window would only fail if the user provided a valid username with an invalid password
- I decided to use Bootstrap for this project because it is pretty popular and I wanted to learn it. I did not make any changes to the existing Bootstrap css
- I used express.json to convert the body of requests into json so it was easier to work with. I used express.static to serve files like script.js. I used express.urlencoded to help with the login request.

## Technical Achievements
- **Tech Achievement 1**: My site gets a 100% when running Lighthouse for desktop

### Design/Evaluation Achievements
- **None**: 
