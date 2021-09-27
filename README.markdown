## Punting Tracker - Detailed Statistic Tracker For Football Punters

Glitch server: https://a3-lorendiloreto.glitch.me/

The goal of the application was to create a full stack web application that I could use in the future as a punting stat tracker to get better at punting. Some of the major challenged that I faced involved Express as well as the MongoDB database. The Express bugs seemed quite annoying because they were very small errors, however, the MongoDB errors made sense because of the basic idea behind databases. I chose to implement cookies as authentication because it was easier, and didn't want to waste precious time on OAuth. I used Mini.css as my CSS framework because it was very lightweight and I liked the compatibility with mobile devices. I barely had to modify the css framework at all. Most of the changes I had to do were changes a couple variables in the framework css code to change various background colors.
Five middleware packages:
1. express.static - serves all files statically in a certain directory
2. body-parser - parses request bodies as they come in as long as the headers are defined correctly
3. cookies - used for authticating users, cookies use browsers to keep track of login status
4. url-encoded - similar to cookies in that it parses incoming requests with urls
5. custom middleware - checks to see if a user is authenticated using cookies, and if not sends them to the login page

## Technical Achievements
- **lighthouse tests**: I got 100% in the 4 lighthouse test categories for my application

### Design/Evaluation Achievements
- **12 W3C tips**: I followed the following 12 tips from the W3C Web Accessibility Initiative:
1. "Use headings to convey meaning and structure" - I made sure to use headings in each major section of my website to help convey a similar structure across the page.
2. "Keep content clear and concise" - I tried to keep all of my content very clear and concise by providing short headings and bits of information. There are no long descriptions anywhere on either of my pages.
3. "Provide sufficient contrast between foreground and background" - I made sure to provide a large difference in contrast between the backgrounds and foregrounds. The blue background and the white tiles have a large difference in contract and the tiles and buttons also have a large difference in contrast.
4. "Don’t use color alone to convey information" - I made sure to convery information by text and positioning, not just color. The only things that use buttons to convey information are the green submit and login buttons, which also use text and strategic positioning to convey information.
5. "Ensure that interactive elements are easy to identify" - All of the interactive elements of my website are highlighted as a button in which you can interact with.
6. "Provide clear and consistent navigation options" - I placed my buttons in a consistent location so that most buttons are in a group of two, which help intuition.
7. "Provide easily identifiable feedback" - When users input incorrect credentials or poorly formatted inputs, the errors they receive are clear and shown in multiple methods. For my forms, I change the border color of the input and display an error message at the bottom of the form in red.
8. "Create designs for different viewport sizes" - I used a framework which provides an easy way to adapt to different sized screens. My application adapts to three different sized screens: small, medium and large.
9. "Associate a label with every form control" - I provided a label for every form input, and added border highlighting on the input when its label is hovered over.
10. "Identify page language and language changes" - I identified the language as "en" with the lang attribute to improve search engine omptimization.
11. "Reflect the reading order in the code order" - I made sure to reflect the reading order in the order of my html file. The one exception I made to this rule was the popup window that appear when you edit profile or edit a punt, because those appear in a different sequence than the rest of the elements.
12. "Write code that adapts to the user’s technology" - I specified the viewport so that people with smaller screens will have just as good of an experience than people with larger screens. When the screen gets smaller, the elements rearrange to accomodate the size change. 
