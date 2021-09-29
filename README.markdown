Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Job Application log

Link: Been fighting for about 2 days with the deployment of my website. Ive tried deploying to glitch and heroku. Heroku is currently giving me an Internal Server Error. And the glitch one is not showing my css. However, if I get it to work it will probably be here -> https://a3-carlos-velasuez.glitch.me/login

Dummy Account:
username: admin
password: pass


My application is a simple JOB Application Log that allows the user to keep track of their job applications. 
<img width="1221" alt="Screen Shot 2021-09-27 at 11 40 29 AM" src="https://user-images.githubusercontent.com/59028126/134941349-45951ff9-0c9f-49d9-b0f4-e2bd31e45bc2.png">

The main page allows you to insert new entries, medify old entries and delete either all of them or one in particular. 
All of the buttons have warning that either warn the user what is about to happen if they proceed, or the instructions for the given assignment. Below you can see the different warning signs

Edit entry:
<img width="444" alt="Screen Shot 2021-09-27 at 11 40 48 AM" src="https://user-images.githubusercontent.com/59028126/134941749-febb6ce1-0c15-43ed-8019-45eace2eb620.png">

Delete All entries:
<img width="441" alt="Screen Shot 2021-09-27 at 11 40 57 AM" src="https://user-images.githubusercontent.com/59028126/134941817-23c328e9-c648-40aa-ae78-31784263d455.png">

Delete a specific entry:
<img width="443" alt="Screen Shot 2021-09-27 at 11 41 07 AM" src="https://user-images.githubusercontent.com/59028126/134941865-cfc71d67-c9e7-458a-9b3c-29d5af522de5.png">

Using passport and with the help of various tutorials I battled my way through to create a login system. This login systems has an admin account already registered and you should be able to see the already saved entries associated with the user once you log in. Additionally, I added warning messages indicating that the username or password are incorrect, apart from a logout button at the top right hand corner of the screen that works properly. 
<img width="1223" alt="Screen Shot 2021-09-27 at 11 42 39 AM" src="https://user-images.githubusercontent.com/59028126/134942344-bd115d0a-e277-4e3d-af12-58a1b709fbec.png">
<img width="1250" alt="Screen Shot 2021-09-27 at 11 42 52 AM" src="https://user-images.githubusercontent.com/59028126/134942347-8ed6c112-c9d6-435e-a55b-1d283f63a1c0.png">
<img width="1231" alt="Screen Shot 2021-09-27 at 11 43 13 AM" src="https://user-images.githubusercontent.com/59028126/134942350-f4b2f1ee-9335-4c07-b045-999f306dcfca.png">

I did most of the styling myself since I did not get to see that we could be able to use a templating CSS tool. However, I very happy wth the look of my website. Besides, I asked in the discord chanel if using express handlebars would be considered here. 

lighthouse report:
<img width="469" alt="Screen Shot 2021-09-27 at 11 51 30 AM" src="https://user-images.githubusercontent.com/59028126/134943785-35e0ac0b-f1a9-45c2-b04e-90fafd612cbb.png">


middleware packages:
- All post and get requests were done through app.get() and app.post() for easier routing
- app.use(express.json()) to automatically convert incoming requests into json.
- app.engine to enable my handllebars
- app.set to set my handllebars
- app.use(session({...})) to start a session with user interacting
- app.use(passport.initialize()) to initialize the passport used for login.
- app.use(passport.session()) to create a passport session to allow for login functionality.
- const userIsAuthorized = (req, res, next) => {...} as a to check if user is able to login or not
- app.use(express.static("public")) allows acces to the rest of my files in public

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2** used heroku to deploy

### Design/Evaluation Achievements
- **Design Achievement 1**: 
