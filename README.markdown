## A3 GDGARSSON

my glitch (or alternative server) link: https://a3-gdgarsson.glitch.me/

- The goal was to allow users to store objects containing the information they fill out with the survey (such as name,
    major, hobbies, etc.), as well as modify and remove them, with the list updated each time they perform one of these operations.
- The main obsticle in the application was 
- I chose to store the login info as objects in a collection on Mongodb, with the username currently being used while logged in stored in a cookie, almost entirely because it was the easiest to implement.
- I used Bootstrap v3.4.1 as that was what was recommended and made the form easier on the eyes with its simplistic design.
- The three Express middleware packages I used were: 
  - Body-Parser, which automated the server-side process of turning request bodies back into JSON objects
  - Cookie-Session, to keep track of which user was logged in from a given client that connected
  - Timeout, to prevent overly long requests/responses (capped at 5s)
  - I would've included more but I ran out of time :( (I tried to use morgan as evident from the code)

## Technical Achievements
- **Tech Achievement 1**: I made a basic authorization method with a username and password, and used cookies to keep track of who
      was logged in for a given client
- **Tech Achievement 2**: I made a table that updates itself anytime the database is modified, and only
      displayed the objects that were relevant to the user that was logged in

### Design/Evaluation Achievements
- **Design Achievement 1**: I made a very simplistic-looking survey, with a table that clearly separates each response
