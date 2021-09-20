A3 Persistence
---
By Federico Galbiati (fgalbiati). Web app available at https://a3-federico-galbiati.herokuapp.com/

Please log in with a GitHub account.

## Lost & Found

The goal of the project is to store lost & found items in the database, and provide them to the frontend through Node.js. The platform allows only the creator of an item to modify/delete it.
- challenges you faced in realizing the application
- The app uses Passport.js with the GitHub authentication strategy to allow any user to log in. Once logged in, it will use the user's email as a unique ID for creating items.
- I used Primer (https://primer.style) as the CSS framework for this project. I already had some experience with Bootstrap, and Primer is the framework used by the GitHub team. Therefore, I thought it would be nice to try it out and learn the foundations of GitHub's website UI.
  - The only modifications that I made are included in the `style.css` file. They were necessary to hide the "edit" form when not in use, and to create a table collapsed border.
- The five Express middlewares used are cookie-session, Passport.js, serve-favicon, compression, morgan, and a custom `validateLoginMiddleware` to check if the user is logged in by checking the cookies.
    - cookie-session allows storing information in the browser related to the logged in user. This info includes the email which is used as a unique identifier on the platform.
    - Passport.js is used to provide single sign on through the GitHub Auth api to access the Lost&Found platform.
    - serve-favicon allows serving a favicon - small logo image for the website usually displayed in the tab bar - to the user.
    - compression allows compressing incoming and outgoing HTTP requests to minimize the bandwidth usage.
    - morgan is a logger used to log any activity on the website. Specifically, it logs which webpages are visited, when, and by who.
    - `validateLoginMiddleware` checks if the req.user variable is valid. This contains the cookie information of the logged in user. If it is invalid, the user is not logged in and is redirected to the GitHub login page.

## Technical Achievements
- **Tech Achievement 1**: I used Passport.js to allow users to authenticate through GitHub.
- **Tech Achievement 2**: I used Heroku instead of Glitch. I found the two platforms to be very similar, but Heroku was more convenient thanks to the autodeploy function which updates the live version as soon as I commit to GitHub.

### Design/Evaluation Achievements
