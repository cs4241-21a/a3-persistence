## Flappy Block

http://a3-aidan-pecorale.herokuapp.com

Login if dont want to sign up username="tester" password="test123"

My application is site for users to relax and play a small game to compete with classmates and others online. Functionality of the site (after logging in) includes my Flappy Block game where you can post your highest scores to the global leaderboard, and the ability to review the game afterwards. The app design lends itself to having the whole leaderboard and all of the reviews accessible to everyone but users can only edit/delete their reviews and only post new scores under their username. The most difficult challenges I faced in making this application was setting up the communication with the mongoDB server and finding a way to store the ID's of entries so that users could only edit their own reviews. Ultimitly I used mongoose for communication with mongoDB and stored the ID's with the entries and only made them accessible using your username which is stored in the cookie session. For authenticating users I simply took the provided template and add a small amount of communication with mongoDB to check if the username and password are stored together in the database. I also added a sign in page to create a new user. The CSS framework I used was bootstrap because it is one of the more heavily documented frameworks available and simple to implement though I did use some custom CSS on items that were alredy implemented from the last project.

5 Middleware used:
- bodyParser -- Parses HTTP request body and helps make manipulating json variable easier.
- response-time -- Records the servers response time for various functions and calls
- cookie session -- Establishes a cookie based session used for checking login status and retrieving username when necessary
- morgan -- HTTP request logger, very helpful in identifying when requests were being sent and showing their status
- connect-timeout -- sets timeout period for HTTP requests and kills them if they are stalling.



## Technical Achievements
- **Tech Achievement 2**: I used Heroku for deployment rather than glitch. 

