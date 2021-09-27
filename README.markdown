Image Board
===

https://a3-nicholasmarkou.herokuapp.com/

This project is an extension of a2-shortstack where I originally created an anonymous image board. This extends it by adding authentication by accounts. This authentication lets you see the poster of every post on the homepage, and allows you to manage your own posts by clicking on the `See your posts here` link. A screenshot of the homepage is below.

![](/writeupImages/indexPage.png)

The management page lets you modify the title or description of any post, or delete the post entirely. Any changes that occur here are also shown on the homepage for all users. The screenshot below shows how the only my post is shown on my profile and the image posted by Ben is not shown, thus the user can only modify their own posts.

![](/writeupImages/myProfile.png)

During the development process, I experiencied difficulties interacting with my database (MongoDB). It was straight forward inserting data, but I had difficulties searching for contents of the database that fit certain conditions, in addition to modifying them. Everything else only required small adaptations to the code from a2 to work with the new server (express) and retrieving data from mongodb instead of a json file.

I used a username and password for authentications for two reasons:
  1. It was easy to implement due to it just being two text inputs that are submitted to the server through a post requests
  2. It allowed the user to have a unique username and display name to be used as the author for every post on the website.

I used the sakura css framework on my webpage due to it being easy to implement and the design of it worked well with the site. I kept some of my old styling from a2, in particular I kept the grid display to make sure every post had its own box, with three on each row. I also limited the size of the images and text area forms to make sure they didn't take up the whole screen, and centered the input of textboxes. 

I used the following middleware in my project:
  - cookie-session - This is used to to authenticate the web session after a successful login or registration. 
  - cookie-parser - This is used to parse unauthenticated cookies on the website (in particular, the username, to load the myProfile.html page.)
  - redirect users (custom made) - This was a custom made middleware which uses cookie-session to redirect the user to the login/registration page if they are not authenticated. It checks to see if the login cookie is true for authentication.
  - body-parser - This is used to parse json which can be retrieved from MongoDB or submitted as a post request from the website. 
  - serve-favicon - This is used to put a favicon.ico on every webpage.

## Technical Achievements
- **Tech Achievement 1**: I used Heroku to host my website instead of glitch. While it took much more effort to initially setup the webpage to work on heroku compared to glitch, the extra effort made it much easier to apply any changes, as all I needed to do to push changes was `git push heroku main` in my terminal. This also stops the page from going to sleep after 5 minutes like glitch. In addition, it was easy to use .env capabilities securely through the config page of herokus website. Overall, heroku gives you much more control of your projects deployment in comparison to glitch. 


- **Tech Achievement 2**: 100% on Lighthouse tests\
index.html: 
![](/writeupImages/lighthouseIndex.jpg)
createAccount.html:
![](/writeupImages/lighthouseCreateAcc.jpg)
accountLogin.html:
![](/writeupImages/lighthouseLogin.jpg)
accountLoginFail.html:
![](/writeupImages/lighthouseLoginFailed.jpg)
myProfile.html:
![](/writeupImages/lighthouseProfiles.jpg)