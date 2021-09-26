Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
Homework Agenda Application
---

heroku link: http://a3-charlie-roberts.glitch.me
glitch link: http://a3-renee-sawka.glitch.me

<img width="1783" alt="ManagerSS" src="https://user-images.githubusercontent.com/64321589/134538351-4248226f-95da-4ac8-9d0d-0ee010528539.png">

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
  - Passport: Used to authenticate using github
  - Timeout: Used to set time until timeout for hanging HTTP request to the login page.
  - Json: Used to parse incoming requests with JSON payloads and then use that parsed data (if Content-Type matches) to populate a body object on the request.
  - Static: Used to serve the static files for the website.

Achievements
---

## Technical Achievements

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication with passport.js using GitHub authentication.
- **Tech Achievement 2**: I hosted my site on Heroku. Heroku is a better service than Glitch in that it is a cloud application platform, allowing users to build, deploy, and scale web apps and APIS. I think Heroku has a much cleaner UI than Glitch, making it easier to navigate, but for very simple web app deployment (like we are doing in this class), Glitch is much more user-friendly in terms of ease and clarity.
- **Tech Achievement 3**: I achieved 100% on all four lighthouse tests for both the login page and main page of my website.

## Design/UX Achievements
- **Design Achievement 1**: Made my site accessible using the resources and hints available from the W3C.

*Tips for Writing*
1. Provide informative, unique page titles: I changed the title in my HTML file to describe what the application does as opposed to having it generically say CS 4241 Assignment 3.
2. Use headings to convey meaning and structure: I changed the layout of my page to make it more clear which blocks of HTML elements are related to one another, distinguishing the directions from the form table.
3. Make link text meaningful: For my logout and login links I described the content of the link target as opposed to using an ambiguous link text such as 'click here'.
4. Write meaningul text alternatives for images: On my login page I included an image of what a written homework agenda looks like described how the online version works in the alternative text for the image.
5. Provide clear instructions: In my directions paragraph I clearly described input requirements to ensure that the user inputs valid attributes.

*Tips for Designing*
6. Provide sufficient contrast between foreground and background: I used colors with lower luminance and ensured that the text as opposed to the backdrop had a stark contrast by using black and white. I changed the CSS framework to use a darker color for the primary color, so that the white text on the buttons contrasted enough to make it easily readable.
7. Ensure that interactive elements are easy to identify: The logout link and the buttons on my page have very unique/distinct styles compared to the rest of the page, ensuring that they can easily be identified.
8. Ensure that form elements include clearly associated labels: The way I structured my table ensured that each button and radio button had the label included in the element (buttons) or right adjacent (radio buttons. The other input fields all have their corresponding label as the column header, since the form is structured as a table.
9. Use headings and spacing to group related content: I changed the padding and margins between my headings  and the elements that correspond to them to make them have a clearer relationship.
10. Include image and media alternatives in your design: I included a caption below the picture of a generic homework agenda on the login paeg.

*Tips for Development*
11. Associate a label with every form control: For each element within the table, there is an associated label element which is linked to the id attribute of the form element.
12. Include alternative text for images: Similar to tips for writing #4, I took the image I included on the login page and included alternative text for the image. 
13. Identify page language and language changes: I used the lang attribute in the html tag to specify the primary language of every page as English. 
14. Reflect the reading order in the code order: I structured my code in a way that the order of HTML elements in the code matches the logical order of the information presented. The sequence is meaningful because changing my order of content would affect the meaning of the page.
