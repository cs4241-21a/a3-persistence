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

 - **Design Achievement 2**: I use the CRAP principles in the Non-Designer's Design Book readings. For Contrast, my color of the text and the background are all different, which can help user being attract by the content. For example, in the login and submit page, I use three totally different colors, for the text, I use the black color, and for the background, I use the white color. However, to make the button different, I decide to use the green button for the login page and blue/green/red button for the submit page. The reason to color the button differently is based on their functions so that the user does not mistake them. For edit the content, I use a gentle color for user to edit the information happily. But for the delete button, I decide to use the red color to notice the user that once he clicks the delete button, he will never get the data again. I also use bold font for the main title and the title in the table, which can also help user clearly understand what this section is. For repetition, it can help to better engage readers. When readers identify patterns, they tend to be more invested in the content as they locate the continued patterns. In order to achieve this, I repeat the formatting, such as font style, colors throughout the entire website. For example, the font and the color of the text in the header of the table are the same in the main site and the profile site. The input text in the profile page also has the same font for the table in the main site and profile site. I also use the same layout, color, font for the button in the sign in and sign up. For alignment, it creates relationships between a document’s elements and the page itself, and it leads readers’ eyes, thus catapulting their attention onward. Take my login and sign-up page for example, because the input box for username, password and button for submit have the same width, so they all aligned with one another. It is the same for the sign-up page, the only different is there have a new input box for user to input their Display Name, but the logic is the same. For my main page, the table is all aligned with one another, which help user can easily find the information in the table. It is also the same in the submit page, the operation button which is Edit and Delete have the same width and height, so they all aligned with one another. For proximity, I keep similar elements near one another. Doing this will create flow and harmony throughout the document. Take my login and sign-up page for example, all related elements (Input the username, input the password, Sign in button, Sign up button) are place very close to each other in the same box. This can help user realize that they are related to each other. Once user sign in successfully, it will jump to the profile page. In the profile page, it makes two boxes for different related elements. For the top box, it includes the input box for user to input their content about assignments. They are all related and placed in the same box. For the box below, it includes the content which user input before, and list in Type. They are again related and placed in the same box.
