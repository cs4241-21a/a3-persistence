# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

Due: September 20th, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express),
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

## Baseline Requirements

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
- HTML that can display all data _for a particular authenticated user_. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

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

## Deliverables

Do the following to complete this assignment:

1. Implement your project with the above requirements. A good potential starting point is to use the "hello-express" project template inside of Glitch; this appears as an option when you hit the "New Project" button. Use the work you did in the last assignment as a reference to implement functionality.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch, it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

## Acheivements

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%.
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README,
why it was challenging, and how many points you think the achievement should be worth.
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

_Technical_

- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/).
  _You must either use Github authenticaion or provide a username/password to access a dummy account_.
  Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment.
  Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.

_Design/UX_

- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). _Note that all twelve must require active work on your part_.
  For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively
  getting it "for free" without having to actively change anything about your site.
  Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard.
  List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings.
  Which element received the most emphasis (contrast) on each page?
  How did you use proximity to organize the visual information on your page?
  What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?
  How did you use alignment to organize information and/or increase contrast for particular elements.
  Write a paragraph of at least 125 words _for each of four principles_ (four paragraphs, 500 words in total).

## Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)

## Your Web Application Title

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- The goal of this application is to provide a simple proof-of-concept server-side calculator, with no other purpose. Do not investigate further. (You can embed secret messages in the computation the server performs, and some messages provoke special replies that are visible ONLY TO THAT USER. Non-secret responses are visible to EVERYONE. If you can't figure out a secret message, try converting "forta" and making the expression evaluate to that value. This is only a test of the secret message function, other secret messages usually provide hints as to how to find more secrets.)
- challenges you faced in realizing the application
- I chose to implement my own simple login authentication, both because it seemed simplest and because it meets the minimal authentication needs of this website while imposing no other account requirements to access the calculator.
- I used the Water.css framework for two reasons. Firstly, it is simple to use. Secondly, the intent of the website is actually _not_ to look fancy; the website is actually meant to look somewhat minimal and functionality-oriented.
  - I made only minimal changes for spacing in some areas and a warning class to make text red. The accessibility css is discussed in greater detail later.
- The five Express middleware packages I used are:
  - cookie-session: to handle and use browser-based cookies.
  - body-parser: to parse JSON the client sends to the server for me.
  - serve-favicon: to allow the use of a favicon (a cute lil calculator icon, in this case). Favicon retrieved from icons8.com.
  - helmet: to automatically add some security with best-practice headers.
  - custom: I use a custom middleware function that redirects the user to the login page if they are not logged in and continues otherwise.

## Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
