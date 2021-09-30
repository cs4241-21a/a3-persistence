Mago Sheehy - http://a3-mago-sheehy.glitch.me

*Given an extension*

## WPI Course Organizer
My application allows users to store the names, codes, professors, and grades for any class they have attended at WPI.  The user must fill out each field with the necessary information before submitting a new course.  The 'Department' field is a calculated field, its value is taken by accessing the letters present in the course code and matching them to a department with a switch statement.  The page was formatted using the 'grid' functionality.  The application also calculates the student's GPA based on their grades, which can either be an A (4.0), a B (3.0), or a C (2.0), any other value defaults to a GPA contribution of 1.0. 

I faced many challenges while working on the application including getting my two mongodb databases connected to the app, checking input against data in the databases, adding, modifying, and deleting data from mongodb, getting the application to pass the lighthouse tests, switching between html files, and modifying the structure of my A2 code to work with multiple users

The authentication strategy I used involved a collection of users being stored in a mongodb database.  The user can create an account by inputting a username and password in the signup section and clicking the 'sign up' button, and once a user is created, the credentials can be used in the login section to progress to the content of the application.  No two accounts can have the same name, and passwords are checked by matching the input to the users stored in the database.  Each user session is made unique through the use of a hidden feature in each data point which stores the username of the user the data is associated with, which is persistant.  There are three default nodes that appear for every new user that is created.  I chose this strategy because it seemed the most straightforward to me and avoided the complicated oauth steps.

I used the tacit css framework because it was minimalist and because it looked the nicest out of the 10+ I messed around with.  The framework is so minimalist that I had to keep much of the css from A2 that I had written, but the difference between the look of the application with and without tacit is very significant.

compression - made files significantly smaller, speeding up the application when transitioning between html files and loading initially
static - allow the service of static files, necessary for serving the html files
bodyparser - handled some of the json manipulation on the server-side behind the scenes, allowing for cleaner and easier-to-write get and post methods
helmet - increased the security of the application (not super important for this application specifically, but it increased the security nonetheless)
serve-favicon - allowed an icon to be displayed next to the website title in the tab selector
