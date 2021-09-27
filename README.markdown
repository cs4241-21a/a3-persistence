Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 23th, by 11:59 AM.

**Math Game**

http://a3-joseph-scheufele.herokuapp.com/

The TA can use username: joe and password: joe or create their own user.

The goal of this application is to be a math based game where the user can select whether they want to multiply or add two numbers together. Once the game mode is chosen, they click start and use the keyboard to enter their answer to each prompt. After 60 seconds, the game ends, and the user's score is saved to the database and displayed on the side of the screen. The user may hover their mouse over a previous score and click on it to open a dialog that will allow them to delete the score. If the user does not wish to delete the score, then they may update the score instead through another dialog that appears after hitting cancel on the first dialog.

Some challenges I faced were figuring out how to get passport to save the user cookie properly and how I could access it. Another challenge was figuring out how to make sure that only the user signed in could view their data and no one elses, my solution to that was to just add the id associated with the document containing the user's log in credentials. Another challenge I took upon myself was to add background music, and tones for right and wrong answers.

I chose to do the username/password strategy, because although I implemented passport middleware, I did not have the time to figure out how to do Oauth2 and so I stuck with what I knew I could accomplish.

I used the NES.css framework for my game, I think that it is quite fitting since I made a game. Since this framework does not do its own layouts, I had to use the css grid layout to organize everything on the screen. I also needed to go in and add some paddings to make things not stuck to the edges of the screen.

The five express middlewares that I used are:
 - Passport - Handles checking the username and password and creating a cookie that holds the current user session.
 - serve-favicon - Serves a favicon icon in the tab for the page.
 - json - Helps parse json files when serving documents from the mongodb server.
 - cookie-parser - Used with passport to create a cookie that holds the user information.
 - express-session - Used with passport to maintain the user that is signed into the game.

## Technical Achievements
- **Heroku Hosting**: I hosted my game on the heroku hosting service. It was really easy to implement, all I had to do was make an account and connect with github. I think it is a better alternative to glitch, since it can auto update with every git push.
- **Importing sound**: I figured out how to add sound to the game along with right and wrong answer tones. Perhaps that is worth a point?

### Design/Evaluation Achievements
- **C.R.A.P.**: 
- C - The elements that recieved the most contrast I believe are the Titles of each container and the page itself. There is a large enough difference between font sizes for emphasis. I also made the games prompt a different color to really highlight its difference. Also, as the time ticks down, I change the colors of the fake buttons and the timer.
- R - For repetition, I use the same container for the grid effect and I use the same color for all the buttons to signify that they are part of the prompt. 
- A - For alignment, I use the grid display, all the elements are aligned in a grid patten.
- P - For proximity, I put the answer area and the timer near each other, then had the start button. Previous scores is futher away, because it is not part of the immediate game. History is closer, because you may want to see what the previous correct answers were. I also put the game mode, right next to the select game mode container.
