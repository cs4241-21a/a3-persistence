Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## The Fridge
I failed to get my app set up on any platform despite numerous efforts. The app only works on local host. 

npm install
npm start
then proceed to http://localhost:3000/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

The goal of the application is to track what items og into your fridge and their expected expiration dates. I faced countrless challenges during the process of making this application. Firstly, I wanted to use heroku but struggled to maintain the usability of app as heroku would fail to build continously which wasted a lot of time. 

I chose to maintain a database of the user and logins and checking if the user & login combination was part of the db. 

I used bootstrap css with custom modifications.

The Middle wares I used
Firstly, I used mongodb to manage user credentials and the data.
Secondly, I usedody-parser, responsible for parsing the incoming request body before it is handled
Thirdly, I tried to implement cookie-parser, which parses the cookie header and populate the req.cookies field.
Fourthly, I tried to impletement morgan, which shows a log of HTTP requests
Fifthly, I implemented response-time, which records the HTTP response time
Additionally, I used connect-timeout, which allowed me to set a timeout period for HTTP requests
I also tried to implement OAuth but could not get it to work in time. 

Light House


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative.
- 
