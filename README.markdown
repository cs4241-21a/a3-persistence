Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
Homework Agenda Application
---

heroku link: http://a3-charlie-roberts.glitch.me
glitch link: http://a3-renee-sawka.glitch.me

**Brief Project Summary**
---
- The goal of this application is to provide users with a method of managing their classwork, allowing them to track the course, percentage, deadline, and their current grade in the class related to a particular homework assignment.

- The main challenge I faced in realizing the application was in handling all of elements in each row, and updating them according to the data present in the database/passed from the server.

- For my authentication strategy, I chose OAuth with GitHub. It was proclaimed to be the hardest technical achievement offered in webware and I wanted to see if I could successfully implement it.

- I used the Pico CSS framework (https://picocss.com/docs/). I really liked the aesthetic of it, it is very minimalistic, elegant, and clean looking. It falls under the general purpose category and therefore I did not have to worry about the framework being highly stylized in a way that detracts from using the application. Finally, the Pico framework is very lightweight, leading to a higher lighthouse score.
The modifications I made via custom CSS I authored include:
  - Changing the primary color to indigo and the data theme to light-mode in order to have a starker contrast, keeping in mind the Lighthouse contrast scores.
  - Changing the padding of some of the text and radio buttons, so they don't go right up to the edge of the window/seem right on top of one another.

- Express middleware packages
  - Session: Used to create and manage sessions, set the attributes of maxAge, secure, and HTML only of cookies.
  - Passport: Used to authenticate using github.
  - Timeout: Used to set time until timeout for hanging HTTP request to the login page.
  - Json: Used to parse incoming requests with JSON payloads and then use that parsed data (if Content-Type matches) to populate a body object on the request.
  - Static: Used to serve the static files for the website.


Achievements
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




## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
