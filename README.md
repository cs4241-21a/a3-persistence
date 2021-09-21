CS 4241 Assignment 3: Persistence

Winnie Ly

This project focuses on using a database (MongoDB) to persist data from an authenicated user that logs in with a specific username and password. 

The part I struggled the most was thinking and planning about the linking between the authenicated user to the associated data that should show up in the table. 

I used the Sakura CSS framework on the login.html because it draws the user's eye to the login form with the dark contrast of the background. I made modifications to the buttons, textarea, labels, and h1 with the border-radius, text colors, alignment, and sizes. 

The authenicated strategy that I used was that I created another collection in MongoDB that stores usernames and passwords and in the main collection would have an element that contains the authenicated username with each document. From this, each query pertains to a specific user from their username.

The five middleware that I used:
- body-parser, responsible for parsing the incoming request body before it is handled
- morgan, shows a log of HTTP requests
- response-time, records the HTTP response time
- connect-timeout, setting a timeout period for HTTP request preocessing
- cookie-parser, parses the cookie header and populate the req.cookies field.

Design/UX Acheivements:

Contrast: The colors of each page shows contrast as they do not blend together making it easy to read for the user. For the login page, I used the Sakura CSS framework which has a dark background color which brings out the contrast of the bright-colored login form that the users have to fill out to get to the main page. Once the user logs in to the main page, the first element that the user will see is the title of the webpage "Getting Enough Sleep?" as it is bolded and the font size is larger than any other elements on the page. After that, the user's attention will go top-down as the next element they will see are the top two text boxes as each text boxes and the table are different colors to distinguish itself.

Repetition: Repetition is present in both pages as well. With the login page, the font inside the login form are all the same and the alignment with the text areas and the buttons are left-aligned which allows users to easily navigate through the page. Once the user signs in to the main page, the repetition is present with how the font for the input text areas and select box are the same while the font for the buttons are different. The color used are also within the same weight as they are "light", pastel colors which fits with the background image used for the webpage. The font used for the table headers and cells are the same which distinguishes itself as it is meant to shows the results to the user.

Alignment: With alignment, it is also present in both pages which guides the user's attention as they go through the webpages. For the login page, the elements in the form are all left-aligned and so when user signs in they start with the top-most element which is the username label. After that, their attention would descend (going to the username text area, etc.) For the main page, most of the elements are center-aligned as seen with the text areas, select box, and the buttons. This will guide the user's attention from the title of the webpage then down to the leftmost text area and then go to the rightmost text area and so on. From this, it guides the user from the top going down and moving left to right.  

Proximity: Proximity is also present in both the login and main pages which creates a flow throughout our website when the user accesses it. For the login page, the text areas are close/near each other while the buttons are in a group themselves where they are a bit further away from the text areas. This allows the user to know and differentiate between the two groups as they log in/sign in to get to the main page. For the main page, the three input fields are close together (the two text areas and the select box) to designate that those are the fields that the user needs to input. The two buttons are in a similar state as with the login page as they are in a group themselves and are a bit further away from the input fields. The table is also a bit further away from the buttons which establishes itself as another group which produces the results of the user's valid inputs. 