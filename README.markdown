Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Car Registry Website

Glitch link: http://a3-evan-llewellyn.glitch.me

Goal: The goal of this app is to allow users to register their cars online with little effort (and for free).

Challenges: I had many challenges throughout the way. Most of them involved of passing data between the client and server (e.g setting the body variable). I would try to add another field to the body variable before sending it to the server (but after it was declared and populated), but I was either doing it wrong or that wasn't allowed. Another challenge I faced was getting data from the input fields since I forgot I needed to add ".value" to the DOM calls. The last noteworthy challenge I had was editing the data in every aspect. It took awhile to get another form for editing preexisting data to populate and then return the edited fields properly. Then I had to figure out how to save the ID that MongoDB gave that data's document so I could edit it in the database. I ended up adding a invisible field to the table which stored the ID of the data's document (probably not the best way but it works).

Authentication Strategy: I just did a username and password login and checked if the matched what was in the database (if username didn't already exists, it creates a new account). I picked this strategy because it was the easiest to implement.

CSS Framework: I used Tacit because it had a very simple and clean look to it (especially for the table). I did make some modifications to margins for some headers and captions as well as making some text bold for emphasis. Otherwise, I just changed the background color, set up the grid properly, hid the edit form, and made my rows disply properly.

Express Middleware: 
  Morgan: Logs completed HTTP requests and the time it took the execute them.
  Response-Time: Logs the response time of an HTTP request as well as the request url and status code.
  Connect-Timeout: Times out a request with a given interval in the Express app
  Serve-Static: Allows for the serving of static files (in this case files in the public folder)
  Helmet: Helps secure the Express app by setting various HTTP headers

## Technical Achievements
- **Tech Achievement 1**: I achieved 100 in each of the four lighthouse tests on each of my pages. You can run the tests yourself in incognito mode or reference the pictures I put in the repo.

- **Tech Achievement 2**: Adding on from my A2 submission, I added in proper checks on the user login to make sure that if a username already exists but the wrong password was provided they would error and have to put in the correct one. The login check alone is probably only worth a point or two (if any, not sure if that was expected or not), but if you add in the checks I did before for the car registry input, then it should be worth around five points.

### Design/Evaluation Achievements
- N/A
