## Team Assignment Scheduler

- Ke Zhao : https://a3-ke-zhao.glitch.me/
- For Heroku: 

This website allows user to submit their Assignments for teammates to view and schedule for the remaining time! When user first enter the website,
they can easily see all assignments no matter their teammates or themself. Once user click login and log into his account, he can see his own assignments,
and he can create, edit, and delete the assignments which show up in the table.
The primary challenge I faced is on how to seperate different user's data, how different user communicate with each other, OAuth authentication,
and designing the website. I chose Bootstrap as my CSS framework, it is documented well and really easy to use. I made no modifications to the framework.
The OAuth authentication strategy I chose is passport because it seemed the easiest.

 5 Express middleware packages:
- Passport - A flexible authentication solution 
- Morgan - An HTTP request logger. 
- Body-Parser - Parsing HTTP request bodies. Used for accessing form and JSON data from the client.
- Express-session - HTTP session management; Store user data to associate requests with the logged in user.
- serve-favicon - Set the favicon on all pages without adding a link tag to each page.

## Technical Achievements
- **Tech Achievement 1**: I implement OAuth authentication: passport.
- **Tech Achievement 2**: I also host my site on Heroku: 

### Design/Evaluation Achievements
- **Design Achievement 1**: 
