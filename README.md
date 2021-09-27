

# The Game of Blackjack

https://a3-ben-gelinas.herokuapp.com/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

## Summary

The Game of Blackjack is a web application for playing a simple game of Blackjack against a computer opponent. It features an account system, a money balance that persists between sessions, a global leaderboard, and an account management page that lets you modify account information. There were many challenges faced when realizing the application. I chose a simple Username and Password combination to login, with that information being stored as a document in my database. My authentication system had many problems in the beginning, including being able to register with no username and/or password and being unable to modify your account info. Since my project is a game, making all of the important game elements appear without requiring users to scroll was also a challenge. I chose to use pico.css for my CSS Framework. Pico made it much easier to read, but even that had some problems, one of which being that buttons and text inputs stretched across the screen by default.
![Bet Form](/public/images/bet_amount.png)
The only modifications I made to the framework were slight changes in color for buttons, which made them a little brighter.
For middleware packages, I used body-parser, cookie-parser, cookie-session, serve-favicon, and a custom middleware package that redirects unauthenticated users to the login page.

For the game itself, there is a full description on how to play on the main game page by clicking on the Show/Hide Help button.

## Technical Achievements
- **Technical Achievement 1**: I hosted my application on Heroku instead of Glitch. Even though the process was a little confusing at first, I liked using heroku more than using Glitch. Heroku had more options to choose from and there was a logs tab that allowed easy access to console logs, which was something I had to use to debug a part of my project. I also did not have to wait for my project to start up, which was a small benefit but a benefit nonetheless.

