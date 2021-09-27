Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 27th, by 11:59 AM.

Ivan Martinovic
http://a3-ivan-martinovic.herokuapp.com/

## XXXL Gym Membership Managment Page
---
This web page is supposed to be a web page for managing gym memberships of a gym I used to go to back home in Bosnia (the gym doesn't have any official website, except for a facebook page: https://m.facebook.com/profile.php?id=100057309077774&refsrc=deprecated&_rdr

##From A2

The website allows (presumably the admin of the page) to add new gym members to a pre-existing data set, by filling out a form. There are two derived fields: the first one being the id of each individual member and the expiration date which signifies when the membership for a given member expires (and both of these fields are always disabled). The expiration date depends on the join date, and the type of membership (Monthly, Yearly and Lifetime). Please note that the expiration date input field calculated automatically upon changes to the two previously mentioned fields on the client side (for the convenience of the person entering the info) and then after adding the members also on the server side for security purposes. 
The project used a grid positioning CSS technique. It includes an unused header area (possibly in the future a menu/navigation bar) could be put there; an area for positioning the Gym Logo, an area for positioning the form, an area for positioning the primary and secondary buttons, and finally an area for positioning the table.
Using the site should be straight forward: to add a new member simply fill out the form and click the big green button that says "Add New Member" (note: both the client and the server will prevent the insertion of an entry with one or more empty fields). To clear the fields, just click on the "Clear Contents" button.
On the bottom of the website is a table which lists the information about all members which go to the gym. On the right side of each entry there are two buttons/icons: a modify button and a delete button (both can be identified by howevering the cursor over them which displays a label). The delete button deletes the entry. The modify button copies the fields of the corresponding table row into the input fields of the form. It also changes the primary button for adding a new member, to a yellow button which says "modify" (notice also how the Id field now reflects the id of the member we are modifying). Once we make the desired changes to the form's fields, we simply click the yellow button which modifies the entry. To cancel modifying an entry, click on the "Cancel" button. 

##Stuff added in A3
A login page where one can either log-in to an existing account or register to a new account (a unique username must be provided). Account usernames and passwords are kept inside mongoDB. Inside the admin (main.html) page, the user may log out using the "Log Out" button in the top right corner.
Similarly the data is made persistent using mongoDB.
Five express middleware packages used: 
-static
-json
-urlencoded
-cors
-cookie

On top of those 5, my own middleware was added to handle logging in, registering and logging out. All of the previous functionality handling adding, modifying or deleting member info was converted from pure javascript to express middleware. 

I used the Foundations CSS framework. However instead of linking it, due to performance issues, I used the 'critical' tool to extract only the critical CSS from framework and inline it in my HTML. Most edits to the Foundations framework were to adjust colors, or to adjust margins since sometimes content seemed to be a little too spaced out. 

The authentication strategy is a simple username/password combination, which is then looked up in the database. It was chosen since it was simplest to implement. You can use the username "Ivan" and password "ivanpass" to login to the page. However, if you wish you can also register a new username and password (the only restriction being that both are at least 1 character long, and contain only letters and numbers).

The site generally achieves 100% on `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
using Google [Lighthouse] ... however the 'Performance' and 'Best Practices' tests seem to vary from test to test. 

Main challenge I've faced in developing the application is getting 100% in the 4 tests in Lighthouse. The Performance and Best Pracices fields seemed to be most inconsistent. Sometimes I'd get a 100% on all 4 tests when developing something locally, but once uploaded it would only occasionally give a 100% on all 4 tests ... fixing some issues lead to others, and I think right now is the best I can make it

Acheivements
---

*Technical*
- (5 points) Instead of Glitch, my site is hosted on [Heroku].
Unlike Glitch, Heroku allows users to re-deploy projects from GitHub. Heroku also provided developers with logs, and in general more professional level tools for hosting their website. They allow the developer to restrict access to their site, check its activity, transfer ownership etc. The only downside of Heroku is that it does not allow editing projects inside Heroku itself. The changes must be pushed to github first and then re-deployed which can take a considerable amount of time. 

- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.  
The site generally achieves 100% on `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
using Google [Lighthouse] ... however the 'Performance' and 'Best Practices' tests seem to vary from test to test. 


*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. 
##Writing for Web Accessibility
##Provide informative, unique page titles
There are essentially two pages:
The login page: titled "XXXL Gym Login Page"
The main/admin page: titled "XXXL Gym Admin Page"

##Write meaningful text alternatives for images
Apart from the background image, the only other image is the Logo, which is properly titled as "XXXL Gym Logo"
Modify buttons display "Modify this entry when you hover over them"
Delete buttons dipsplay "Delete this entry when you hover over them"

##Keep content clear and concise
The forms are (at least to everyone I showed the website to), clear to use, with all buttons and input fields clearly labeled. The table rows and columns are also clearly labeled.

##Designign for web accessibility
##Provide sufficient contrast between foreground and background
Enough contrast is provided on the whole website and the "Lightouse" "Accessibility" tst can attest to that fact

##Ensure that interactive elements are easy to identify
Forms and buttons are clearly visible, primarily since their color is in great contrast with the background.

##Provide clear and consistent navigation options
On the index page there are "Login" and a "Register" button, and it should be obvious what they do and where they lead. 
On the main page there is a "Log Out" button which logs the user out, and brings them to the home page.  

##Ensure that form elements include clearly associated labels
This one is self explanatory ... all form fields have labels which are clearly associated with them

##Provide easily identifiable feedback
If Login/Register Fails a message appears stating this fact.

##Use headings and spacing to group related content
Buttons associated with forms are either placed inside the forms or close enough to them, that it is obvious they are related

##Include image and media alternatives in your design
As discussed previously the Logo image contains a title

##Developing for Web Accessibility
##Associate a label with every form control
As discussed previously, each form input has a clearly associated label which goes along with it.

##Include alternative text for images
As discussed previosly, the logo image contains an alternative text.

##Identify page language and language changes
Page language is identified on all html pages as "English"

##Use mark-up to convey meaning and structure
Appropriate markup is used to denote tables, buttons and forms (and labels and input fields)

##Reflect the reading order in the code order
On the index page there is only the logo on the left and the form on the right. This is reflected in html markup by having the logo come before the form. 
On the main page there is a logo on the left, a form on the right and a table on the bottom. This is reflected in the html markup by making the logo come first, the form come second and the table come last. 

##Provide meaning for non-standard interactive elements
Custom-made buttons for modifying and deleting entries have a title which displays their functionality when the cursor hovers over them.


- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
##Which element received the most emphasis (contrast) on each page?
On the login page the element which received the most epmhasis is the login form. It is (almost) white which is in the biggest contrast with the background. Inside the form itself, the biggest contrast is given to the "Login" button, which is supposed to be the primary button.
Inside the main page, the biggest contrast is shared between the form and the table. Closely after that, the "Add New Member" button receives the highest contrast, as it is the primary button. Once one of the modify buttons is pressed, the highest contrast is placed on the "Modify" button, which now takes on the role of the primary button. 

##How did you use proximity to organize the visual information on your page? 
On the login page the logo and the form are spaced out ... the logo is placed on the left side, meanwhile the login form is on the right to indicate that they are unrelated. Inside the form, there are two buttons which indicates they are associated with the form.
On the main page there is a similar structure: logo on the left, form on the right, table on the bottom. The main difference (apart from the table) is that buttons which interact with the form are not placed inside the form itself, but rather right next to it which still indicates they are related. In the top right corner there is now also a "Log Out" button. It is placed away from the form to indicate it has nothing to do with it, but only with authentication. 

##What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?
The background image and the logo are repeated on both the login and index page. The logo is on the left, and the form is on the right side on both pages. The forms on the index and login page are the same color, with same circular edges. The primary buttons are colored green. Secondary buttons are colored white. Some auxiliary buttons are colored yellow. Font inside buttons is always the same. 
 
##How did you use alignment to organize information and/or increase contrast for particular elements. 
Inside the login page the logo and the form are slightly vertically misaligned to provide contrast and indicate they don't share funcitonality. The Buttons inside the form are center-aligned to organize the information better.
Inside the main page the logo is flushed right, and the table is at the bottom and centered. The form is placed on the left side. The buttons associated with the form are placed right next to it and center aligned vertically to the form, as well as horizontally to each other to provide better organization. The log-out button is misaligned to the two buttons to provide contrast and emphasize it is not related to either them or the form.




