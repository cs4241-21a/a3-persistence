## League of Legends team sign up 
Link: https://a3-jasonodell2001.glitch.me/
This application allows users to input their information into the server to sign up for a league of legends team. 
The server stores the users information (username,password, name, summoner name, role, rank) 

The main struggle I face while working on this project was getting the system to properly store user information and keep the current user set correctly. I also struggled getting the server to swap between webpages based on the users input. 

I used cookies to authenticate because I found it the easiest to implement and didn't have time to implement oauth 

I used the modern-normalize CSS framework because I felt it was simple and most appropriate for my simple website. I was originally going to use 98.css because I like the windows 98 style but I felt it didn't fit my website. 
The middleware I use in this project are: 
- express.json to allow for JSON parsing. 
- express.static to serve static files 
- express.urlencoded to allow the system to connect to mongodb 
- cookies to allow for users to stay logged in 
- bodyparser to parse the incoming data from the client. 
Test user information: 
username: test1
password: test1 
Technical Achievements: N/A 

Design/Evaluation achievements: N/A
