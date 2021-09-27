## Tip Calculator

Glitch Link: https://a3-aburke921.glitch.me/ 

The goal of this application is to allow users to quickly determine how much each person in a group(or individual party) should pay, with a tip added to the total amount due. When constructing this webpage, I had a difficult time trying to properly space the different elements in the form. While there is still room for improvement, using the bootstrap CSS framework was very helpful with aligning things. I chose to use bootstrap because it is one framework that I hear a lot about and want to be able to familiar with widely used concepts and practices in the real world. For this assignment I used four Express middleware packages and a few additional pieces of middleware that I generated myself. 
1. body-parser: This piece of middleware is helpful in that it automatically parses client-server requests (from within the server). I utilized the body-parser.json() to help parse incoming request into json objects. 
2. cookie-session: This piece of middleware that stores a user session within a cookie. This was how I was able to implement user authentication and logging in.
3. morgan: This piece of middleware is a HTTP request logger for node.js. This was very helpful when it came to debugging and how the different post & get methods I created were being called. 
4. cookie-parser: This middleware will parse Cookie header and populate req.cookies with an object keyed by the cookie names. This is how I was able to retrieve the username of the user that was currently logged in (for adding their saved receipts to the DOM)
5. noAccess (my own middleware function): This piece of middle ware was used for get requests to the login page or to the receipts page so that unauthenticated users would be forced to login before being able to calculate any tips.


## Technical Achievements
- **Tech Achievement 1**: I got a 100% in all four lighthouse tests. This can be seen on all the login page, create account page, and the receipts page. 

<img src="/images/Login page Lighthouse">

<img src="/images/Create Account Lighthouse">

<img src="/images/Receipts Page Lighthouse">

- **User Logout (10pts)**: While it was not a given technical achievement, I think it should be considered to be one. Logging the user out and removing any cookies was extremely difficult and required several hours of debugging and multiple sessions of office hours for help. While simply removing cookies was not necessarily the hard part, I have implemented it using redirects in a way that if the user hits the back button, it does not re-log the user in rather continues to ask them to sing in.



### Design/Evaluation Achievements
- **Design Achievement 1**: I used CRAP principles in the Non-Designer's Design Book readings.

- *Contrast*: The first part of CRAP design rules is **C**ontrast. Contrast allows certain parts of the page to attract the user’s eye. Through my webpage, there were various parts that I increased the contrast in order to allow it to capture the user’s eye. In the login page and the create account page, I was able to add contrast to the form by using the autofocus form attribute to emphasize where a user must begin filling in information. When either of these fields are initially loaded, the first input field of the form is highlighted indicating to the user that it is ready to be filled out. In addition, on every page, the forms have a shadow which elevates them from the page. This allows the form itself to stand out compared to the rest of the page and stick out to the user’s eye.


- *Repetition*: The next part of CRAp design rules is **R**epetition. Throughout each page, there were many things that I tried to keep as consistent as possible. One thing was the font of the forms. The purpose of the google font I had chosen was to make the form look like it was a real receipt. By using the same font for all of the saved receipts and editable receipt form, I was able to give a paper-like theme where each individual saved receipt seemed like it was torn off of the original form. Additionally, the font for the rest of the web application remained consistent. All other text that was not in the receipt form had to do with the user logging in or creating an account. By this repetition, I was able to show their relevance to each other.

- *Alignment*: The *A* in CRAP stands for **A**lignment. In all three pages to the application, I centered the main form in the middle of the window. This shows its significance and attracts the user. Additionally, in the receipts page the input fields that had to do with price were aligned with each other. I especially made sure to align the “Amount Due:” and “+ Tip:” labels so that the colons would be vertically in line. This creates a uniform look and is also set up like the traditional receipt one would get at a restaurant. This same alignment technique was used for the saved receipt, additionally adding “= Total / Person:”.


- *Proximity*: The final part of the CRAP design rules is **P**roximity. This rule emphasizes that elements that are related should be placed closer together than those that are not. This can be seen very easily on all pages. In the login page, the two input fields are placed close together as are the login button and the create new account link. The two input require user information while the button and link both take the user to a different page and location. Additionally, on the receipts page the pre-calculated tips are positioned closely together, the input fields are positioned closely together with an extra margin in between. This is to help show the user, they do not need to provide any input for the pre-calculated tips.