## Your Simple Todo List App

Heroku link: https://cs-4241-a3-benstaw.herokuapp.com/

The goal of the application is to provide a simple todo app to organize weekly tasks and grade their difficulty.

While completing the project, naturally some challenges came up. This project really forced me to learn how json objects are passed between the client and server, as progressing without that knowlege was very difficult. I also had to learn how to interface with the Mongo api, and learning how to use their function calls was also critical.

For authentication, I decided to keep a cookie in the browser which used information from a correct login. To check if a username-password combination was valid, I kept valid combinations in the database with a tag indicating that they are credentials and user data. Given the resources available, it seemed the most straightforward way to accomplish the task. To log out, remove the cookie from the browser and refresh the page.

The CSS framework I chose was called chota. I liked it because it was very lightweight and was easy to set up. In addition to the framework, I also added some inline styling to the main page to make sure that the table came out in a readable order and had separators between important data.

For this project, I included five middleware packages

1. Bodyparser is designed to take the body sent from the client and parse it for use by the server

2. Cookie-session middleware allows the server to store a cookie in the browser with some given information

3. Morgan is an http logger that can be used to make http requests easier to follow

4. Response-time adds a header to responses indicating the response time.

5. The compression middleware compresses http responses.


- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

## Technical Achievements
- **Tech Achievement 1**: I sucessfully hosted my project to Heroku. I really liked how easy it was to attach my github to it. I did find it to be a learning curve to get the env variables to work online, but after doing it, it makes total sense. Glitch is nice to have the application preview window, but I feel having to move my files around to fit Glitch's system is a huge hassle. I'm glad heroku doesn't make me do that.

**Tech Achievement 2**: I was able to get 100s on all four lighthouse tests. It took some moving around, but it worked out in the end.

Here is a picture of the full lighthouse:
![lighthouse_proof](./lighthouse_proof.png?raw=true)



