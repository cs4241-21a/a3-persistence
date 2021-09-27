Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## The Fridge
I failed to get my app set up on any platform despite numerous efforts. The app only works on local host. 

npm install
npm start
then proceed to http://localhost:3000/

The goal of the application is to track what items og into your fridge and their expected expiration dates. I faced countrless challenges during the process of making this application. Firstly, I wanted to use heroku but struggled to maintain the usability of app as heroku would fail to build continously which wasted a lot of time. 

I chose to maintain a database of the user and logins and checking if the user & login combination was part of the db. 

I used bootstrap css with custom modifications.

The Middle wares I used
Firstly, I used mongodb to manage user credentials and the data.
Secondly, I use body-parser, responsible for parsing the incoming request body before it is handled
Thirdly, I tried to implement cookie-parser, which parses the cookie header and populate the req.cookies field.
Fourthly, I tried to implement morgan, which shows a log of HTTP requests
Fifthly, I implemented response-time, which records the HTTP response time
Additionally, I used connect-timeout, which allowed me to set a timeout period for HTTP requests
I also tried to implement OAuth but could not get it to work in time. 



## Technical Achievements
- **Tech Achievement 1**: Good lighthouse metrics

Light House
![image](https://user-images.githubusercontent.com/15680552/134867973-70b5bcd1-7683-4beb-84dd-66e0c13edac4.png)
![image](https://user-images.githubusercontent.com/15680552/134868030-c761bfb4-d8d7-49d6-aa08-6848e1140580.png)

- **Tech Achievement 2**: Used local authentication

### Design/Evaluation Achievements
- Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative.
- Make link text meaningful - All the links in the website has a specific purpose like log in log out and sign up.
- Associate a label with every form control - All my input tags have a form tag with it with a for attribute. They are invisible in the tasks table but the - table column headings takes care of that.
- Provide clear instructions - The error during login is clear and provide instructions.
- Ensure that form elements include clearly associated labels - All my input fields have visable text labels that they can clearly be associated with.
- Identify page language and language changes - html tag of all pages has the lang attribute of en.
- Help users avoid and correct mistakes - Error messages show up on my login and register page when there is a problem with the user input.
- Don’t use color alone to convey information - Every elements on the page have text associated with them.
- Provide sufficient contrast between foreground and background - There is a significant contrast between the text and background which makes the page easily readable. 
- Ensure that interactive elements are easy to identify - All interactive elements on the app have been styled with Bootstrap to stand out.
- Provide easily identifiable feedback - Buttons are responsive like removing and submitting. There are also error feedback on the page. 
- Use headings to convey meaning and structure - There are headings for the different parts of my app on each page.
- Ensure that all interactive elements are keyboard accessible - The page can be used with only keyboard
