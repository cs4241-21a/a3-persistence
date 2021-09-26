

## daily expense

glitch link [https://a3-yonghua-wang.glitch.me](https://a3-yonghua-wang.glitch.me)
heroku link [https://aqueous-ridge-57845.herokuapp.com/](https://aqueous-ridge-57845.herokuapp.com/)

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application is to record your daily expense 
- challenges
  1. improve accessibility of my site
  2. learn NEW css framework
  3. deploy on heroku
  4. learn to use MongoDB API
  
- use local username/password authentication stratigy
  the local one allows the database to easily locate the user by simply matching both password and username
- what CSS framework you used and why
  Bootstrap. This is very popular, and it makes pages clean and professional
- the five Express middleware packages you used
  1. I use express static to serve static files
  2. express.json to parse json data in post body
  3. cookie to create cookie for request
  4. session to store the session in the server to remember the user
  5. a middleware to check database's connection
  6. a middleware to check is user has a session
  7. body-parser.urlencoded to parse bodies from URL

## Technical Achievements
- **Tech Achievement 1**:
  1. I deploy my project on both heroku and glitch
  2. Almost achieve all 100 in lighthouse test. Lose in accessibility due to injected grammarly tag
     ![lighthouse score](lighthouse.jpg)
     ![lose_points](aria_problem.jpg)


### Design/Evaluation Achievements
- **Design Achievement 1**:
  I followed the following tips from the W3C Web Accessibility Initiative
   1. Provide informative, unique page titles
    > everyone page has its own title to indicate its functionality, e.g, sign in page has title log in page
   2. Make link text meaningful
    > links instruct user with account to login, who has no account to register
   3. Provide clear instructions
    > at registration page, user to told what to input and what format is acceptable, e.g, email should be format of *@*.*
   4. Provide sufficient contrast between foreground and background
    > make background black to contrast with component in the page white
   5. Ensure that interactive elements are easy to identify
    > all buttons and input will respond to user's action such as hover on or cursor becomes a hand
   6. Ensure that form elements include clearly associated labels
    > forms inputs all with label to help improve accessibility
   7. Identify page language and language changes
    > all pages contain meta information with <html lang="en">
   8. Help users avoid and correct mistakes
    > user are told to input require format of email, in case of invalid input, user will receive alert message

