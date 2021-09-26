## Assignment A3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

Link to application: https://a3-willwht.glitch.me/

My submission for assignment A3 is an application which allows users to register and log in to accounts, ![Image of registration/login fields](https://i.imgur.com/b3I0Icx.png)

And then store information about what pets they have. ![Image of pet info fields](https://i.imgur.com/SOCTBpD.png)

Pets each have:
- A name
- An age
- An animal type

The name cannot be empty, and the age cannot be below zero - though zero is accepted as valid.

Users can add, delete, and modify pets freely.

To add pets, fill in the fields on the pets screen, and click submit.
To delete pets, click the word "Delete?" listed next to a given pet.
To update pets, fill in the fields on the pets screen, and then click the word "Update?" next to a given pet.
  This will set the values for the pet chosen to what the values entered are - assuming the values are valid.
  
When I started working on this application, I had a difficult time - I was unfamiliar with using databases, and was not yet confident with using servers.
I was concerned if I was going to be able to complete the assignment adequately, and was anxious about this for a few days.

However, as I kept researching, and kept inspecting what did and didn't work - what was and wasn't possible, I got more comfortable with databases and servers,
and can now confidently say that I understand (at least to the extent that I used them within this project) how they work, and how to utilize them within my projects.



The authentication strategy I chose to use was using the cookie-session middleware to keep track of a session.  I chose this because it seemed the simplest to understand,
while still being reasonably versatile.  One of my concerns in the beginning was saving a username value across multiple pages, which was completely solved by using
this strategy.

The CSS framework I used was bootstrap - I chose it because after comparing it against some others (namely the Bulma framework), I felt that it was the simplest to use,
and also made my project look the best (I tried to go for a minimalist/professional design here, as opposed to my prior projects' in-your-face blue color schemes).
 - I didn't modify the framework much at all via custom CSS, the only noteworthy edit I made was adjusting the margins to improve the look of my website.  Without 
   adjusted margins, the content of my pages would be directly next to the border of the screen, which was unpleasant to look at - so, I corrected it accordingly.

The middleware I used were:
- helmet
- body-parser
- cookie-session
- favicon-server
- A custom function for redirecting unverified users (users who have not logged in)

The custom middleware I made was based on the example given to us in the cookie usage tutorial/example.  I initially had tried to get the example given to work, but 
was unsuccessful - so, I made something similar which, via an alert, tells users who attempt to go to the pets page before logging in that they have not logged in yet,
and forces them to go back to the login page.

## Technical Achievements
- **Tech Achievement 1**: 5 points - Achieved 100% on all four lighthouse tests.  ![Image of 100% on all four lighthouse tests](https://i.imgur.com/UknlkmV.png)
- **Tech Achievement 2**: 1 points - Added error checking on all pages, preventing invalid inputs for any user or corresponding data.
- **Tech Achievement 3**: 1-2 points - Separated registration/login functionality, and added alerts to inform users of when they provide invalid information. 
