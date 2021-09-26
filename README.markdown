Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Plant Parenthood App

Glitch: https://a3-maddison-caten.glitch.me
Heroku: https://a3-maddison-caten.herokuapp.com/

This application keeps track of a user's plants that they own. It allows you to keep track of the type of plant, its care needs such as type of sunlight and watering, the date of plant adoption to keep track of growth, and additional notes about the plant. 

Goals - The goal of this application is to modify assignment 2 and add functionality so that users can modify and delete entries. Also utilize a database such as MongoDB and add a log-in system to the application.

Challenges - Some challenges that I faced in realizing this application were adding functionality to add/modify/delete entries in the database. I had difficulty implementing this in a2, so it took a lot of extra time to get these features fully functional. I also had trouble making it so that two users could not have the same username. During this, I kept running into error-handling issues on the client-side of the program and confusion on how to implement this in a straightforward way. After attending office hours, I got the feature working.

Authentication - The authentication strategy I chose was based on the example using a database with cookies. I chose this strategy because it seemed like the most straightforward for me to implement to my program. 

CSS Framework - The CSS framework I chose was the Milligram CSS framework. I chose this framework because I liked the minimalist style that it was based on. I also thought that the purple based color went nicely with the color scheme of my existing application (neutrals). I made a couple modifications with custom CSS. These included the font for the title of the webpage and the alignment of the elements on the page. I also modified some of the font sizes as I thought those included with the framework were a little small for the page.

Middleware - 1.) body-parser: This middleware parses incoming request bodies before handlers. 2.) cookie-session: used for log-in implementation and stores the user session. 3.) response-time: Records the response time for requests in HTTP servers. The “response time” is elapsed time from when a request enters this middleware to when the headers are written out to the client. 4.) connect-timeout: Times out a request in the Connect/Express application framework. 5.) (custom) /login.html: redirects user to the login page of the application

## Technical Achievements
- **Tech Achievement 1**: I hosted my site on Heroku instead of Glitch. This is because I think they have similar functionality. I like Heroku more since I have previous experience using it for my MQP project and I like how when you push changes to a github repository the changes automatically update in Heroku. 

- **Tech Achievement 2**: I got a 100% in all four lighthouse tests on all webpages for this assignment. 
Login Page:
![alt text](Lighthouse_Home.JPG)
Index Page:
![alt text](Lighthouse_Index.JPG)

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
  - 1.) Provide informative, unique page titles - The login page clearly indicates its purpose of being a login page
  - 2.) Use headings to convey meaning and structure - Key elements in all the webpages use headings to draw more focus to those elements than plain text (ex. the title of the webpage, different login options: login or sign up)
  - 3.) Keep content clear and concise - I made sure all forms and feedback when the user does something wrong (ex. username taken) is as clear as possible for simplicity
  - 4.) Provide sufficient contrast between foreground and background - I chose a light beige color for the background of the webpage and a dark green for text and other elements so there is a high contrast between background and foreground.
  - 5.) Don’t use color alone to convey information - To avoid this, I used alert pop-ups to let the user know if they have done something incorrectly
  - 6.) Ensure that form elements include clearly associated labels - Both the form to add elements to the database and the login form are clearly labeled with what information goes where
  - 7.) Provide easily identifiable feedback - Alert pop-ups make feedback easily identifiable to the user
  - 8.) Use headings and spacing to group related content - The title of the page has the largest heading, and elements that go together are grouped by heading size. For instance the add plant and my plants are the same size heading since they are correlated, but not as large as the title.
  - 9.) Identify page language and language changes - On every page, the primary language is indicated as English
  - 10.) Use mark-up to convey meaning and structure - WAI-ARIA roles are included for every table/div element
  - 11.) Provide clear instructions - The instructions on each page are very intuitive and straighforward on the webpage, by design. Otherwise there are clearly written instructions for the user to follow.
  - 12.) Ensure that interactive elements are easy to identify - All clickable buttons on the webpage are bright purple and clearly state what they do (ex. "logout" logs the user out of the application)
