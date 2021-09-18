## TODO List

Heroku Link: https://a3-timothy-goon.herokuapp.com/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

### The goal of the application
This is a TODO list web app that allows for the creation and management of a todo list. Users can create accounts directly on the app or use a Github account login.

### Challenges you faced in realizing the application
The greatest challanges making this app was figuring out how to fix the Cumulative Layout Shift problems with Google Lighthouse and learning how to do Oauth with passport.js.
The Cumulative Layout Shift problems were fixed by using the ejs html templating engine.

### What authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
I have two authentication strategies for my app. The first is the traditional password approach that stored hashed passwords on the database with bcrypt. The second was the use of Oauth for Github. I did the first one becuase it was the easiest to do while still being considered a standard authentication system. The reason I did the second was for the extra points on this assignement.

### What CSS framework you used and why
The CSS framework that I chose was Boostrap because I already had experience with it in the past and it creates a clean looking UI compatable with most web apps. I did not need to write any of my own css.

### The five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please add a little more detail about what it does.
1. morgan - Automatically logs data about http requests to the terminal. Usefull for debugging.
2. express.json() - Automatically parses json strings sent to the server.
3. express.urlencoded() - Automatically parses requests with url encoded data.
4. cookie-parser - Automatcially parses cookie data and makes it available in req.cookies.
5. express.static() - Allows the express server to serve static files in the pubilc folder.
6. serve-favicon - Gives the client a favicon.
7. express-session - In my app allows for user session management if the user uses the Github Oauth with passport.js.
8. passport.initialize() - Initializes passport.js
9. passport.session() - Allows passport.js to save data to a session from the express-session middleware.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I used hosted the web app on Heroku

I don't thing the app deployment process of Heroku is any better or worse than Glitch. The only noticeable difference was the need for a Procfile that contained a command to start up your server. The rest of the process is the same as Glitch. You just click the button to deploy from a Github repo and you are all set.

- **Tech Achievement 3**: I got 100% on all 3 of my pages with the Google Lighthouse audit.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative.

#### Tips Followed

1. Associate a label with every form control - All my input tags have a form tag with it with a for attribute. They are invisible in the tasks table but the table column headings takes care of that.
2. Ensure that form elements include clearly associated labels - All my input fields have visable text labels that they can clearly be associated with.
3. Identify page language and language changes - html tag of all pages has the lang attribute of en.
4. Help users avoid and correct mistakes - Error messages show up on my login and register page when there is a problem with the user input.
5. Provide sufficient contrast between foreground and background - Google Lighthouse helped me fix all these.
6. Don’t use color alone to convey information - All interactive elements on the page have text associated with them.
7. Ensure that interactive elements are easy to identify - All interactive elements on the app have been styled with Bootstrap to stand out.
8. Provide easily identifiable feedback - Tasks appear and disappear when added and removed. There are also error messages on forms when the user provides bad input.
9. Use headings to convey meaning and structure -  There are headings for the different parts of my app on each page.
10. Make link text meaningful - Each link I use has text the conveys its action such as logging in from Github or redirecting to the login or register pages.
11. Provide clear instructions - The error messages on my login page are clear and provide instructions.
12. Ensure that all interactive elements are keyboard accessible - I'm able to navigate my page with only the keyboard.
