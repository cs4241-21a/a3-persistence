

## Jacob Feiss - A3

Heroku link: https://a3-jacob-feiss.herokuapp.com/

The application was made to be the start of a database for storing student athletes information. I chose the to authenciate users through mongoDB using cookies because it was the easiest way to do it. I chose to use Pure.css, I would have liked to spend more time styling but time started running out too quickly, I chose pure because I like the freedom that it allows the developer to use in adapting the framework to fit their own style. I changed some small things to the framework like colors text size and added some different styling for tables. 

The 5 express middlewares I used:
  - express: Automatically delivers all files in the public folder and gets data sent by default form actions
  - mongodb: Database that is implemented to serve the client side with all of the displayed information.
  - cookie-session: Saves the current user's information so their information can be accessed throughout different screen states
  - body-parser: parses JSON that is passed into the server side automatically so there is no need for reduntant code at the beginning of every server function.
  - A custom middleware to help authenticiate users on app startup between sessions.


## Technical Achievements
- **Tech Achievement 1**: I used Heroku instead of Glitch

