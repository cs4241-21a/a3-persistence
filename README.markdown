Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 23th, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows all data associated with a logged in user (except passwords)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Use of at least five [Express middleware packages](https://expressjs.com/en/resources/middleware.html). Explore! One of these five middleware 
can be a custom function that you write yourself; if you choose to do this, make sure to describe what this function is in your README.  
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas)
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). 
This should do the bulk of your styling/CSS for you and be appropriate to your application. 
For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:  

HTML:  
- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two pages for this assignment, one that handles login / authentication, and one that contains the rest of your application.
For example, when visiting the home page for the assignment, users could be presented with a login form. After submitting the login form, if the login is 
successful, they are taken to the main application. If they fail, they are sent back to the login to try again. For this assignment, it is acceptable to simply create 
new user accounts upon login if none exist, however, you must alert your users to this fact.  

CSS:  
- CSS styling should primarily be provided by your chosen template/framework. 
Oftentimes a great deal of care has been put into designing CSS templates; 
don't override their stylesheets unless you are extremely confident in your graphic design capabilities. 
The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

JavaScript:  
- At minimum, a small amount of front-end JavaScript to get / fetch data from the server. 
See the [previous assignment](https://github.com/cs4241-19a/a2-shortstack) for reference.

Node.js:  
- A server using Express, at least five pieces of Express middleware, and a persistent database (mongodb).

General:  
- Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse) (don't worry about the PWA test).
Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment. 

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. A good potential starting point is to use the "hello-express" project template inside of Glitch; this appears as an option when you hit the "New Project" button. Use the work you did in the last assignment as a reference to implement functionality.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch, it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the 
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. 
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README, 
why it was challenging, and how many points you think the achievement should be worth. 
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). 
*You must either use Github authenticaion or provide a username/password to access a dummy account*. 
Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. 
Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!  
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.  

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. 
For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively 
getting it "for free" without having to actively change anything about your site. 
Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. 
List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
Which element received the most emphasis (contrast) on each page? 
How did you use proximity to organize the visual information on your page? 
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 
How did you use alignment to organize information and/or increase contrast for particular elements. 
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Image Board

https://a3-nicholasmarkou.herokuapp.com/

This project is an extension of a2-shortstack where I originally created an anonymous image board. This extends it by adding authentication by accounts. This authentication lets you see the poster of every post on the homepage, and allows you to manage your own posts by clicking on the `See your posts here` link. A screenshot of the homepage is below.

![](writeupImages\indexPage.png)

The management page lets you modify the title or description of any post, or delete the post entirely. Any changes that occur here are also shown on the homepage for all users. The screenshot below shows how the only my post is shown on my profile and the image posted by Ben is not shown, thus the user can only modify their own posts.

![](writeupImages\myProfile.png)

During the development process, I experiencied difficulties interacting with my database (MongoDB). It was straight forward inserting data, but I had difficulties searching for contents of the database that fit certain conditions, in addition to modifying them. Everything else only required small adaptations to the code from a2 to work with the new server (express) and retrieving data from mongodb instead of a json file.

I used a username and password for authentications for two reasons:
  1. It was easy to implement due to it just being two text inputs that are submitted to the server through a post requests
  2. It allowed the user to have a unique username and display name to be used as the author for every post on the website.

I used the sakura css framework on my webpage due to it being easy to implement and the design of it worked well with the site. I kept some of my old styling from a2, in particular I kept the grid display to make sure every post had its own box, with three on each row. I also limited the size of the images to make sure the images didn't take up the whole screen, and centered the input of textboxes. 

I used the following middleware in my project:
  - cookie-session - This is used to to authenticate the web session after a successful login or registration. 
  - cookie-parser - This is used to parse unauthenticated cookies on the website (in particular, the username, to load the myProfile.html page.)
  - redirect users (custom made) - This was a custom made middleware which uses cookie-session to redirect the user to the login/registration page if they are not authenticated. It checks to see if the login cookie is true for authentication.
  - body-parser - This is used to parse json which can be retrieved from MongoDB or submitted as a post request from the website. 
  - serve-favicon - This is used to put a favicon.ico on every webpage.

## Technical Achievements
- **Tech Achievement 1**: I used Heroku to host my website instead of glitch. While it took much more effort to initially setup the webpage to work on heroku compared to glitch, the extra effort made it much easier to apply any changes, as all I needed to do to push changes was `git push heroku main` in my terminal. This also stops the page from going to sleep after 5 minutes like glitch. In addition, it was easy to use .env capabilities securely through the config page of herokus website. Overall, heroku gives you much more control of your projects deployment in comparison to glitch. 

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
