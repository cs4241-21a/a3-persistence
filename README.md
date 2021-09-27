A3 Persistence
---
By Federico Galbiati (fgalbiati). Web app available at https://a3-federico-galbiati.herokuapp.com/

Please log in with a GitHub account.

## Lost & Found

The goal of the project is to store lost & found items in the database, and provide them to the frontend through Node.js. The platform allows only the creator of an item to modify/delete it.
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
- I used normal text inputs, but also date, and radio button inputs
- I created a /me page that filters only the elements create by the logged in user

## Technical Achievements
- **Tech Achievement 1**: I used Passport.js to allow users to authenticate through GitHub.
- **Tech Achievement 2**: I used Heroku instead of Glitch. I found the two platforms to be very similar, but Heroku was more convenient thanks to the autodeploy function which updates the live version as soon as I commit to GitHub.
- **Tech Achievement 3**: I got 100% in all Lighthouse tests.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the W3C Web Accessibility Initiative suggestions
    - Use headings to convey meaning and structure: I used headings for the tables and website title. The headings on the tables help to clearly split the content in lost/found. I also used this for the edit/create form to divide the two.
    - Provide informative, unique page titles: Both the login and home page have the title in the suggested format "Title • Website Name"
    - Associate a label with every form control: Every input element for both the edit and create forms have a <label> element linked to the id attribute of the input element.
    - Include alternative text for images: On the Octocat user logo and login button.
    - Identify page language and language changes: I included the <html lang="en"> tag on each page.
    - Help users avoid and correct mistakes: I included an error box that provides an error message from the backend regarding the issue that was encountered. The error box only appears when an error arises and uses the usggested CSS from Primer CSS with a red background.
    - Ensure that all interactive elements are keyboard accessible: All Submit buttons autofocus when the user presses the enter key to confirm the submission.
    - Provide sufficient contrast between foreground and background: I used black/white contrast for most elemnts, or inverted white/black/gray.
    - Don’t use color alone to convey information: All input element labels have a * to indicate that it is a mandatory field and cannot be skipped - as suggested by W3C.
    - Ensure that interactive elements are easy to identify: I used the buttons and interactive elements with default CSS from Primer CSS. I reused the components throughout the UI to ensure the user understands easily what is what and making the navigation easier.
    - Ensure that form elements include clearly associated labels: All the labels are clearly associated with an input element below it. The radio buttons are in the same square bordered box as their label.
    - Provide easily identifiable feedback: If the user does not fill out a field, an alert pops up letting them know the fields are not optional.



