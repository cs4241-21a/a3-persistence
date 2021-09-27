## Life Progression

https://a3-ben-peters.herokuapp.com

I created a simple web app that given a date of brith and gender determines how far through the average life span you are. I didn't run into many issues when creating the application as many of the bugs had been worked out in A2. I did have some issues with redirecting to the login page and then correctly redirecting back to the main page on successful login. I just used a basic authentication method using salted and hashed passwords using the Crypto package for node because it was easy and avoided storing passwords in plaintext. I used bootstrap as by CSS framework and wrote very little additionall CSS. On the main page I wrote CSS to make the update and remove buttons have no backgound and the text to turn blue when hovered as well as adding a few entries for centering differnet parts of the page, I also used CSS to remove the box around the gender dropdown menue. On the login page I didn't autor any changes but I did copy the CSS from the example login page on the bootstrap demo site.
Express middleware:
- favicon: serves the favicon.ico to any clients request before connections are checked for exiting sessions
- json: converts json passed into request.body into a javascript object in request.body
- urlencoded: parses url encoded post data into a javascript object located at request.body
- Cookie: Creates a cookie that stores status of an existing connection on the clients machine as a cookie eliminating the need to login every time
- Static: Serves a static site based on the directory indicated and handles the majority of get requests
## Technical Achievements
- **Tech Achievement 1**: I used heroku to host my app. The experice of using heroku is better than that of glitch because of how easy it is to develop something localy and then just push your changes the the heroku git repo. This is much easier than having to copy and paste any changes into glithc. However, I would way that heroku with a distict lack of a gui has a much steeper learning curve and is much harder to get started with. Configuring the server on heroku was incredibly easy as all I had to do was ensure my package.json was up to date and then push it to the remote repo and all dependiencies were installed.
- **Tech Acheivement 2**: All of the lighthouse tests get a 100, see the git repo for a screenshot for both the login and the content pages.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
1. Provide informative, unique page titles: I changed the title of my pages to be more informative than just assignment information
2. Make link text meaningful: I named my link to the study done by the CDC where it will take the user
3. Provide clear instructions: I provide clear requirments for all entered data fields and use the builtin verification for passwords and dates
4. Provide sufficient contrast between foreground and background: Black text on white background and blue buttons provide sufficient contrast between elements
5. Ensure that interactive elements are easy to identify: All interactive elements have a clear indication which element is slected
6. Ensure that form elements include clearly associated labels: All forms have lables directly above the entry feild making it easy to identify what data goes in each field
7. Associate a label with every form control: All form controls have a label associated with thm
8. Identify page language and language changes: All pages have a lang atribute identifying the languge of the page
9. Ensure that all interactive elements are keyboard accessible: All interactive elements are accessable with only the keyboard
