## Better OwOifier

For this project, I used Heroku for deployment. Here is the link to my deployed project: https://a3-patrick-lee22.herokuapp.com/

The purpose of this application is simple: it's a very rudimentary message board. A user logs in with credentials that they create, and can create messages to any other possible user (even ones with usernames that haven't been claimed yet).
Upon logging into the app, a user will be shown all messages sent to them by any user (even God). They can view the messages in two different views:

1. Table view. This shows the message as a table with two columns: the sender and the message, along with the owo-ified versions of those two fields.
2. Sentence view. This renders the message as a sentence, both normal and owo-ified.

Users can also send messages to anyone they like. The user can input the name of the user to send the message to and the message, along with two key visual options:

1. A fancy text option. This changes the font of the message in all views from the default font to a cursive, swirly font. This option is for those with a flair for the dramatic.
2. A selection of options to choose what replaces exclaimation points in the text of the message. There are three options: text faces (this is the default), emojis, and no replacement.

After sending a message, users can edit their original message in the following ways:

1. Users can change the contents of the message.
2. Users can change the font fanciness.
3. Users can change the '!' replacement option.

It is worth noting that users CANNOT change who the message was sent to. However, if a message was sent in error, the user may instead delete the message and send a new message to the intended recipient.

Authentication in this application is very simple. To create an account, all a new user has to do is input a username and password in the login fields when first entering the application. If the username is taken, there will be a short error message displayed.
This strategy was chosen both due to its ease of implementation and its ease of use.

Much of the visual style of this application comes from the Bootstrap framework, which was used during to give this app a clean look and feel. I chose bootstrap for this application partly due to familiarity with the framework from prior work experience, but also because of the ease of creating interactive animations and clean-looking visuals. Examples of out-of-the-box bootstrap visual effects that enhance this application include:

- Hovering labels for input fields
- Table stylings
- Font choice (non-fancy, of course)
- Button stylings, including hover-fill animations
- Navbar stylings

Another reason why bootstrap was my framework of choice is its grid system. Using css classes, I was able to align items within the application simply by adding a few classes and wrapping div elements here and there. For examples of this, look to the sent messages view.

There were very few css rules I wrote for this project, and the ones which I did write were largely things like borders and extra padding.

Five Express middleware packages were used in creating this application. Here is a list of them, along with what they do.

1. serve-static: this middleware package serves static files (like the css and javascript files powering the application).
2. cookie-session: used to create a cookie to store the username of the currently logged in user.
3. morgan: this is used to log http request information to the console, for ease of developing the app and monitoring it (plus I like things with my name).
4. serve-favicon: this is used to easily send the favicon I created for this application.
5. body-parser: this is used to automatically parse json data from the client.

## Technical Achievements
- **Tech Achievement 1**: As mentioned previously, I used Heroku as my hosting platform for this assignment. While it had a slightly steeper learning curve than Glitch, there was a distinct advantage to using Heroku: automatic redeployment upon a new commit to the base repository. When using Glitch, if I updated the code base locally and then committed my changes, I had to create a completely new project on Glitch to see those changes reflected in the code. Heroku will automatically redeploy the project whenever a new commit is pushed to the origin.
- **Tech Achievement 2**: My application scored 100% on all four lighthouse tests, on both the login page and the main message board. I have included screenshots as proof.