Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

[http://206.189.66.0](http://206.189.66.0)

The goal of the application is to mock an application that requires sign in and stores private user data. Since I
extended my project 2 submission into project 3, user data takes the form of a private leaderboard. It is slightly
confusing since a leaderboard does not fit well with the idea of private user data, but it shows the same concepts. A
user can add, modify, or remove entries from their private leaderboard.

During the creation of this web app, one of the largest challenges was the difficulty I had finding up-to-date
documentation on using oath with express 4. Most of the guides I could find online came in the form of independent
articles going over the rough steps of using oauth 1.0 (or a specific company's oauth interface) with express 2.0 and
3.0. The most frustrating part for me was that most guides provided scattered code samples without including an example
of what all the pieces look like once put together or walking through the steps oauth takes during authentication and
how it relates to the passport.js api. The official passport documentation was far more through, but assumed some
pre-existing knowledge of using oauth. In the end, I decided to implement a vastly simplified manual authentication
system so I could complete the rest of the project and come back to it later. Due to a lack of spare time I was unable
to return to the topic and the vastly simplified authentication is what my project uses.

I decided to use the Semantic UI framework since I had used it before, and it had worked well in the past for me. I only
use custom css for positioning and the background of the login screen. That being said, my "custom" css additions are
largely equivalent to those shown in layout examples for Semantic UI.

### Express Middleware packages
 - `morgan`: Quick and easy logging of incoming requests to help with debugging.
 - `express-session`: Allows server-side data to be attached to a session for easier implementation of routes.
 - `body-parser`: Parse http body to a js object that is easier to work with.
 - `serve-static` (bundled): Handles requests for files by serving files from a given public folder.
 - login checking (custom): Intercepts requests to log in vs authenticated pages and redirects the user to the correct
   page. So authenticated users who attempt to visit the login page get sent to the value view page and unauthenticated 
   users get sent back to the login.

## Technical Achievements
- **Tech Achievement 1**: I hosted my site via a digital ocean droplet. I have had this specific droplet for a while now
 and mostly used it for web scraping data up to now it is just has an IPv4 address with no domain or SSL certificate.

### Design/Evaluation Achievements
*n/a*
