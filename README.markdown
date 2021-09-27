Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## To-Do List

Link: https://a3-evelyntrvn.herokuapp.com/

The overall purpose of the application was to make a simple to-do list that you could edit and delete for each given user based on their GitHub account. 

While developing the application, I had a lot of trouble refactoring my server to use express. I didn't entirely understand the session worked. I wasn't sure what was being called and at what time. To help me figure this out, I worked with asked friends, read lots of documetation, and watched videos to understand what was going on. Another thing I had trouble with was how I wanted to use Bootstrap even after I had already done a lot of CS for the A2 assignment. There are still things I'm unsure on, however, I get a better understanding of the functionality.

I chose to use the GitHub authentication strategy because everyone in this class has a GitHub. In addition to that, many people I knew in the class were also utilizing this method, so I could always ask for help if needed. 

I chose to use Bootstrap because I've never used a CSS framework before and Bootstraps ability to be responsive was really impressive to me. From the small applications I've done so far, responsive layouts are still something that I struggle with, so it was really cool to see how Bootstrap can be used to simplify that process. I used it to adjust my table for the tasks as well as using some of the button classes and margin/padding classes. I had to override some of the color choises of Bootstrap to get at least a 90 for the LightHouse tests so that there was more text contrast. In terms of my script, I had to do a lot of refactoring because the elements were being placed into rows and column divs, so I was very confused for a while. Fortunately I figured it out and was able to access them all.

For the five Express middleware packages, I used body-parser, express.static, express.ResponseTime, express.session, and passport. the body-parser was used to parse the request body data so that I didn't have to stringify and make to a json. The express-static allowed for all the static files be served, particularly in the public directory. The express.responseTime is used to record HTTP response time. The express.server was used to establish server-based sessions. Finally the passport middleware was used to authenticate users to login to their accounts.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. It doesn't work exactly the way I want it to but for the most part it sort of works. What is supposed to happen is that you start on the login page because you aren't authenticated yet and will have to login to access the to-do list. I'm not entirely sure why it doesn't work like that, but if you sign off and login with your account, it will show only data from your account. 
- **Tech Achievement 2**: I hosted my site on Heroku. It does seem a lot more professional than Glitch, however I had a lot of difficulty setting this up. I do enjoy the logs that it has and that it will build the application automatically. It was super useful because I found lots of bugs after in my code and Heroku was able to keep up with the development stage of my application.
