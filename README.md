https://a3-maylee-gagnon.herokuapp.com/

## Your Web Application Title
This application keeps track of a simple contact list including each person's name, phone number, birthday, and whether to buy the person a gift. 

Goals: The goal of this project was to expand on assignment2 and modify the server to use the Node.js server framework Express. This project also invovled having persistant data storage using the database Mongodb. Another goal of the project was to implement a log-in system and allow users to access their corresponding data.   

Challenges: I had a hard time getting the list of entry documents from a particular user. I could get the list of object id's and retrieve each document, however, getting them to array format and returned was difficult. I also found it challenage to keep track of the promises and .then's. I would want to nestle them and had some scope issues with the way I originally organized some code. 

Authentication strategy: My strategy was based on example provided, with simple html and cookies. I chose this because it seemed the most straightforward to implement. I also just stored the passwords as plain text. New usernames will be automatically created a new user account. 
    Test Account: Username: testUser Password: test

CSS framework: I used milligram (https://milligram.io/). I looked through the provided list and like the look of this one. The design was simple and clean which I liked. I made no modification to the CSS framework. 

Express middlware packaged: 
    1. Body parser: Parses the json request body for requests 
    2. Cookie-session: Stores the user session and used for user logins 
    3. Express slash: Redirects the 'http://localhost:3000/' to 'http://localhost:3000/login.html'
    4. Compression: Compresses the response for all requests 
    5. Response time: Times the requests in the servers and outputs it to the console

HTML Inputs/Fields: 
    1. Text
    2. Password
    3. Date 
    4. Checkbox


## Technical Achievements
- **Tech Achievement 1**: 
I used Heroku to host site instead of Glitch. I thought the service was similar to Glitch. I first tried to follow their instructions to connect and deploy through the command line but I had issues getting that to work. I then saw on the website a way to connect to the github project directly which worked. Heroku is able to automatically deploy when a push occurs. This seems to make changes easier than in Glitch. 

### Design/Evaluation Achievements
- **Design Achievement 1**: 