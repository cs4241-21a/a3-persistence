## Team Assignment Scheduler

- Ke Zhao : https://a3-ke-zhao.glitch.me/

This website allows user to submit their Assignments for teammates to view and schedule for the remaining time! When user first enter the website,
they can easily see all assignments no matter their teammates or themself. Once user click login and log into his account, he can see his own assignments,
and he can create, edit, and delete the assignments which show up in the table.
The primary challenge I faced is on how to seperate different user's data, how different user communicate with each other, OAuth authentication,
and designing the website. I chose Bootstrap as my CSS framework, it is documented well and really easy to use. I made no modifications to the framework.
The OAuth authentication strategy I chose is passport because it seemed the easiest.
- The dummy account: 
- username: Ke
- Password: 123
- Or you can also create a user to try it!
![alt text](https://github.com/KorbinZ3/a3-persistence/blob/glitch/a6348221027f3504fc37529c76d2976.jpg)

 5 Express middleware packages:
- Passport - A flexible authentication solution 
- Morgan - An HTTP request logger. 
- Body-Parser - Parsing HTTP request bodies. Used for accessing form and JSON data from the client.
- Express-session - HTTP session management; Store user data to associate requests with the logged in user.
- serve-favicon - Set the favicon on all pages without adding a link tag to each page.

## Technical Achievements
- **Tech Achievement 1**: I implement OAuth authentication: passport.

### Design/Evaluation Achievements
- **Design Achievement 1**: I follow twelve tips for writing, tips for designing, and tips for development. 

tips for writing:
- Use headings to convey meaning and structure: on my website, no matter the main site or the profile site, they all use short headings to group related content and clearly describe the sections. In main site, It have a large heading tell user what the below chart is, and in the profile site, It also have a header which tell user the below box is use for add content.
- Provide clear instructions: In my profile page, where the box that user can input their assignment description, it have a description in that box which give user an example on what to input. It will also change when user click different type of input. For example, when user click the homework button and try to add content, the description will be "Your Homework Description:(CS4241 Homework 1)". When user cliick the project button and try to add content, the description will be "Your Project Description: (CS4241 Project 1)".
- Keep content clear and concise: In my website, all context are in short and clear. All instruction are straightforward. 

tips for designing: 
- Provide sufficient contrast between foreground and background: Foreground text have sufficient contrast with background colors, which the text is black and background is white. For buttons, when you hover your mouse on the button in the top right corner, it will change into green, which also provide sufficient contrast.
- Ensure that interactive elements are easy to identify: The interactive elements are really easy to identify. When user hover their mouse over the button on the top right corner, it will change the color from white to green, and give user notice. It is same when user didn't login, and trying to login.
- Provide clear and consistent navigation options: I ensured that navigation across pages within a website has consistent naming, styling, and positioning. For example, the position, naming, styling are all the same between main page and profile page.
- Ensure that form elements include clearly associated labels: I ensured that all fields have a descriptive label adjacent to the field. Take the login page for example, I clearly label that user should input in the login page, which is their username and password. Also, for the profile page, I clearly label "homework" and "project" on the right-side of the checkbox.
- Provide easily identifiable feedback: I provide feedback for Sign Up page. When user input a username which is taken by others, it will popup a window which tells user that "Username is taken". This can prevent people getting confuse.

tips for development:
- Associate a label with every form control: I use for attribute on the <label> element linked to the id attribute of the form element in the submit.html.
- Identify page language and language changes: I indicate the primary language for index, profile, result, and submit page by using the lang attribute in the html tag.
- Use mark-up to convey meaning and structure: I use appropriate mark-up for headings, table, and buttons. This can be found in nav file in views folder.
- Help users avoid and correct mistakes: I provide clear instructions, error messages, and notifications to help users login to the website. When user wants to create a new account, if he input a username is used by others, it will popup a window tells user that Username is taken.
