## Calorie Tracker 2.0
Jack Ayvazian jpayvazian https://a3-jack-ayvazian.herokuapp.com/

### About
This Calorie Tracking application is a upgraded version of my A2, where it tracks calories intake by entering foods you eat, so you can make more healthy decisions. You can login with existing credentials or create new account, and you will be redirected to main page. Once an item is submitted using the add food form, it will refresh the table where the item can be deleted or edited. Upon clicking the edit button beside an item, the update form will be filled in with the current field values, and the number of calories/servings can be changed and the table will update by clicking the "update" button. The food name is read-only (box is red) when updating, since if you want a different food item it should be added instead. You can logout via the button at the top of the main page.

### Challenges
I faced challenges mostly in debugging middleware. I could not get cookie-session working properly, so I resorted to creating new cookies for the client, and accessing them with cookie-parser on the server. I also ran into issues with helmet middleware raising Content Security Policy errors with my code, so I used different middleware instead.
### Authentication
I used a simple authentication strategy of POSTing user input directly to the server, and checking MongoDB for matching credentials. I would have tried OAuth strategy if I did not run into so many middleware issues, but using cookies with cookie-parser was intuitive as I could see easily track their values within chrome developer tools.
### CSS Framework
I used Bootstrap for my CSS framework, as I've heard it is popular. There was a little bit of a learning curve and it was hard to find resources demonstrating what I was trying to accomplish as it is such a big framework, but I did not end up needing any extra CSS modifications.
### Express middleware
1. body-parser: allows access to request body easily in the server (although it showed as depricated)
2. cookie-parser: similar to body-parser but for cookies; allows you to access client cookies in the server by request.cookies
3. static: serves static files within a root directory (public) such as css, html, and js files
4. morgan: logging tool for showing requests in the server, useful for debugging to see which requests were/were not being called
5. urlencoded: parses incoming requests with urlencoded payloads with extended true, useful for getting data from default form actions/GET requests
6. json: allowed parsing for JSON objects in the request body

## Technical Achievements
- **Tech Achievement 1**: I hosted my site on Heroku. I found it to be pretty simple for deploying directly through Github, the one thing I liked more with glitch was how you could directly change files after importing. However, deploying with Heroku was nice as it tracked changed commited to my github repository.
- **Tech Achievement 2**: Logout feature: I implemented a feature for users to logout via the button on the main page, which will redirect them back to the login page. The username currently signed in will show up right above the logout button
- **Tech Achievement 3**: I got 100% in all four lighthouse tests on both login/home pages  
  
[Here is login page screenshot](https://github.com/jpayvazian/a3-persistence/blob/main/loginpage.JPG)  

[Here is home page screenshot](https://github.com/jpayvazian/a3-persistence/blob/main/homepage.JPG)

### Design/Evaluation Achievements
**Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
1. Provide informative, unique page titles: I labeled my page titles with Login/Home first to distinguish them, followed by "Calorie Tracker" and "CS4241 A3" for added description
2. Use headings to convey meaning and structure: I labeled each of my block sections for Login form, Create account form, Add food form, Update food form, and List of foods table 
3. Provide sufficient contrast between foreground and background: I used a bootstrap "light" page bacgfround color with black text for easy realability, and added more contrast to my page by inverting this with headers, where the backgrounds are black, with white text.
4. Ensure that form elements include clearly associated labels: I've included labels adjacent to each form field, with labels on left side for text, and right side for checkboxes as recommended to facilitate readibility
5. Keep content clear and concise: I used a limited amount of words to convey clear instructions as concisely as possible, with submit/edit/delete buttons, form labels, and headers to signal instructions
6. Ensure that interactive elements are easy to identify: The interactive elements including text fields, checkboxes, and buttons are easy to distinguish as the white colored fields contrast the "light" background color of the page, and the buttons are bordered. The curser changes when hovering these elements to indicate it is text/clickable. I also filled the background of one text field red, to indicate that it was read-only and not interactive.
7. Provide easily identifiable feedback: Users will be redirected upon logging in/out, with their username present on the page to show they have successfully logged in. Once a food is added or updated, the table will refresh automatically with the entry and a total calorie count will update to show it was successful.
8. Identify page language and language changes: Both my pages have tags for html lang="en" to indicate english language
9. Reflect the reading order in the code order:I ordered my elements in the chronologic order that made sense to me, with a login form preceding a new account form, and on my main page, I have the add food form preceding the update form, with the results at the bottom. 
10. Use headings and spacing to group related content: I seperated related content with distinct headers with contrast, in addition to adding "br" tags in between some of them to give added space. I also added thin borders around the form elements to distinguish the content even more
11. Associate a label with every form control: Each of my form labels have a "for" keyword which coresponds to the id of the input fields
12. Help users avoid and correct mistakes: I included alert messages if users try to add negative values for calories or servings, and I also used the "required" tag for form login entries to show the user that the field must be filled in.
