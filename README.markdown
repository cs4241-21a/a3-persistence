## Todoish

Glitch: https://a3-o355.glitch.me

Heroku: https://a3-o355.herokuapp.com

Todoish is a Todo list app, with some inspiration from Todoist. It is based off of the Todoish assignment I submitted in A2, with extra functionality and features.

Todoish uses the Bootstrap 5 framework - this is what I'm most familiar with. I've been using BS4 for a while now, so I wanted to code this in BS5 so I can continue to get familiar with some of the differences between the two.

Two methods of authentication are used - local authentication (passwords hashed via bcrypt), and GitHub OAuth. Local authentication was relatively easy, but GitHub OAuth took a while to implement. Passport.JS has a lot of quirks, and I needed to make lots of changes to data models so that GitHub Users & Local Users could all share the same data model.

A lot of Express middleware is used throughout Todoish, and is listed below:
* Passport.JS for OAuth
* Morgan for server logging
* Cookie sessions to power session states (cookie-session)
* Form data/JSON parsing to parse form data (built-in Express packages)
* Static file serving to serve client-side JS (serve-static)

Additionally, I used these libraries in Todoish:
* Bcrypt for password hashing
* Mongoose for connecting to MongoDB
* Luxon from the A2 version of Todoish
* Dotenv to store sensitive application-specific data

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

Lighthouse tests also pass at above 90% on mobile & desktop.

## Technical Achievements
- **Tech Achievement 1**: Used OAuth via the GitHub strategy.
- **Tech Achievement 2**: Hosted the application on Heroku App. Heroku required some extra configuration, like adapting to the dynamic port system it uses, and creating separate GitHub oAuth clients for Glitch/Heroku (different callback URLs).
- **Tech Achievement 3**: On Desktop, Todoish should get 100% on all four lighthouse tests. On mobile, this metric is either 98/99. Bootstrap is a moderately heavy framework, so that probably drives down the score on mobile.

## Design/Evaluation Achievements
Followed these tips from the W3C:
1. Associate a label with every form control - Every form has a label attached to it for accessibility.
2. Use headings to convey meaning and structure - Major elements have a header. This includes the Login page (different login methods), the main app page (showing what's to do, what's done)
3. Provide clear instructions - Instructions are clear throughout Todoish. The login page is pretty self-explanatory, and toasts describe more in-depth errors. A help button in the main app gives a detailed description of what Todoish is doing.
4. Provide sufficient contrast between foreground and background - Lighthouse threw no warnings with accessibility. Bootstrap is pretty good at making sure contrast is good between elements. Additionally, the main tables in Todoish are striped to differentiate different tasks.
5. Ensure that interactive elements are easy to identify - All action buttons are blue, close buttons are grey, and delete/logout buttons are red to convey their meaning, and importance.
6. Ensure that form elements include clearly associated labels - All form elements on the website are accompanied by a label, and by help text if needed. The done checkboxes have an invisible label that should be accessible to screen readers.
7. Provide easily identifiable feedback - Form validation is present across the entire application to alert users when they are doing something wrong.
8. Identity page language & language changes - the lang tag is used on the HTML.
9. Ensure that all interactive elements are keyboard accessible - Bootstrap does a really nice job making sure that all the elements can be used by a keyboard, and basic testing seems to show that Todoish is entirely usable via keyboard.
10. Help users avoid and correct mistakes - There's multiple layers of validation for login, telling users if the user doesn't exist, or if it exists and there's a wrong password.
11. Provide informative, unique page titles - The login page clearly indicates that it's the login page.
12. Keep content clear and concise - I made sure to make feedback messages as concise as possible without getting too wordy. The same goes for the help modal.
