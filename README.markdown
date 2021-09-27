## Celeste Speedrunning Tracker

http://a3-alan-healy.glitch.me

The goal of this application is to provide a persistent database for users to store information about their Celeste speedruns. When completing a speedrun, the user can enter information such as the final in-game timer, death count, strawberry count, and platform, and save this information in a mongodb database.

Unfortunately, I was not able to fix the issues with displaying this data in time for this assignment. One of the main challenges in this project for me was managing the data flow of various elements in the application. Additionally, I had trouble getting CSS templates to work correctly.

I chose to use an authentication strategy of a simple username and password because it seemed like the easiest to implement. When not logged in, the server will direct the user to a login page and prompt them to enter an username and password. If the username entered does not exist in the database, the app will create a new user with the password entered by the user. Otherwise, the app will attempt to log in the user, directing them to the main application page if their password matches.

The five Express middleware packages I used are: body-parser, cookie-session, serve-favicon, helmet.noSniff, and static. Body-parser is included in the default express package, and is used to parse JSON in the bodies of post requests. Cookie-session is used to save logged in user sessions and allow the user to refresh the page without logging in again. Serve-favicon is used to serve a small favicon image with one of the Celeste chapter logos. Helmet.noSniff is used to set the "X-Content-Type-Options" header to "nosniff", which can mitigate security vulnerabilities due to MIME type sniffing. Static is used to serve static files (such as CSS and html files) from the "public" directory.