## Library of Horrors

https://a3-blueocean090.glitch.me

- the goal of the application was supposed to be a library service where users could insert books they have checked out into the database as well as create an account
- This assignment is not complete because of mental and physical health reasons. The professor knows about this so please check with him when grading.
- I tried to use passportjs and its local authentication for the creation and logging in of user accounts.
- I used the Bootstrap CSS framework with specifially a free bootstrap called bootswatch
- This is the express middleware:
  - I used express-ejs-layouts for the creation of the pages so that it inherits from the layout.ejs
  - I used passport for the user validaiton and the creation/ logging in of user accounts
  - I used mongoose to connect to mongodb as well as creation of item schemas
  - I used connect-mongodb-session to create and store files on the mongodb server much easier
  - I used passport-local for the creation of a local strategy for the logging in
  - I used passport-local-mongoose for the optimization of mongoose user schema user accounts
  - I used body-parser as it is no longer in express, so I had to use a middleware to get the same functionality
  - I used cookie-parser as it is no longer in express, so I had to use a middleware to get the same functionality
## Technical Achievements
- **Tech Achievement 1**: I used bcrypt for cryptographic hashing of passwords when sending passwords (5 points).

### Design/Evaluation Achievements
- **None**
