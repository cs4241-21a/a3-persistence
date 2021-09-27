## Assignment Tracker

Website link: https://a3-jmckeen8-b8oqa.ondigitalocean.app/

This app is essentially the same as what I created for Assignment 2 in terms of purpose/functionality, however it is now updated to include accounts/authentication. Users are required to log in with a username/password. If a user logs in with a username that is not already in the database, a new account is created. Otherwise, the username/password must match an existing database entry to be let in to the website.

Once on the main website, the form at the top of the page can be used to either add a new assignment, or edit an existing assignment in the list. Below the form is a table showing all of the assignments for that user, with all of their attributes. In addition, each assignment has a "Done!" button which the user can use the remove the assignment from the list once they've completed it. 

This website uses the simple cookie authenticator strategy, simply because I didn't have time to try to do something fancy like OAuth lol.

This website uses the Tacit CSS framework, because I was running low on time, and the description "CSS framework for dummies, without classes." piqued my interest. I have to say I was very impressed and it was by far the least amount of work/thought put into CSS for a website I've built, while still creating something clean/modern looking. 

Five Express middleware packages used:
 - body-parser
 - cookie-session
 - response-time
 - morgan
 - serve-favicon

## Technical Achievements
- **Tech Achievement 1**: Used Digital Ocean to host the website. Overall I liked the experience it provided for setting up a website, especially the *surprisingly* seamless integration with GitHub repositories (even more seamless in comparison to Glitch). It set up automatic building upon any new commit to my git repo, gave me helpful feedback in terms of what was going wrong when it failed to build (which happened a few times), and provided an opportunity right as I was setting up the website to specify environment variables, useful for the MongoDB login information. 
- **Tech Achievement 2**: Achieved 100% on all four lighthouse tests required for this assignment, on both index.html and main.html, as well as both "mobile" and "desktop" settings on lighthouse. 

