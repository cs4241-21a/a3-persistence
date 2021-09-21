Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
---

## Your Web Application Title

Heroku link: https://contact-log.herokuapp.com/

Account for Testing-  
Username: admin  
Password: Mike  

The application is a simple contact logging system for users. This can be used for contact tracing, possibly for COVID, or for keeping an up-to-date list of personal or work-related connections. The app implements a MongoDB server for user creation and data storage. HTML and JS were used in unison to build a responsive database system. For CSS, a common framework, called Bulma, was implemented for all the basic needs. Bulma is a free framework with tons of common CSS features, such as Cards and Modal screens. Custom CSS was added to implement the proper Fonts and spacing required for the interface. Furthermore, custom CSS was used to implement a counter for textarea inputs. To run the server, Node, Express, and common middlewares were used for development. Some challenges faced during development were launching the app on Heroku and creating a user registration system. The authentication strategy chosen was a simple Username + Password system. This type of authentication is common across the majority of applications. The website received over 90% for each Google Lighthouse test.  

![Login Page](https://user-images.githubusercontent.com/62816869/134070795-d0ca2775-6e8c-4167-a47b-faa20940e691.JPG)
![Main Page](https://user-images.githubusercontent.com/62816869/134070913-346f22be-1e1f-4476-aa3b-7e41e2d4148f.JPG)


The five middlewares used are:
1. body-parser -> Allows parsing JSON data into the request body.
2. cookie-session -> Allows the use of cookies to store data.
3. cookie-parser -> Allows the ability to parse, and print the cookie data
4. serve-static -> Allows the express server to serve static files in the pubilc folder.
5. passport -> Allows for OAuth authentication.
7. A custom middlware that automatically logs in users that have already signed into the website. It redirects the user to the contact list page if the user is logged in.


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I used Heroku to host the website instead of Glitch.

### Design/Evaluation Achievements
- **Design Achievement 1**: Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings:   
      1.     Contrast: For contrast, I made sure that all colors contrasted each other as much as possible. This allowed aspects of the webpage to be much more visible, and pop                out more for the viewer. For example, the white card color contrasts the green color of the main body on the login page. Furthermore, the table on the                            main page has black text, on a white background, which is as much contrast as possible. On the login page, the login section of the page received the                            most contrast since it was the main focus. For the main page, the table and action bar received the most contrast to attract the user's attention.                                For popups, the contrast was present in the form of making the focus of the screen on the form sections and blacking out the rest of the webpage.   
      2.     Repetition: Some many fonts and colors were repeated throughout the website. This helped familiarize the user with each section of the website, and how to interact                with each webpage. For example, headers were given the font of Sofia, whereas unwritable data was given a more crisp font. The repetition of color helped the user                become familiar with the different aspects of the webpage. Red was for deleting items, green for creating, and blue was miscellaneous. Furthermore, the same                      format for forms was repeated in the web pages, so that users could easily understand when they were required to enter information. Error codes also appear at                    specific intervals in the user interface and are repeated throughout, in red text. The repetition of the color red as bad is a common trend in web pages.   
      3.     Alignment: Alignment is used throughout the application to focus the users' attention via the visual connection. Nothing on the page is placed somewhere                            arbitrarily. Each different element is used to attract the user. For example, the buttons are visually connected. On the login page, the register button and login                button are aligned with one another because the user will either log in or register an account. Furthermore, the add contact button is NOT aligned with the delete                button because they are not involved with one another. In the update form, the user can choose to delete or update an item, and those two buttons are aligned                    since they both involve modifying the selected element. Every element same some visual connection with another element on the page, creating a clean,                            sophisticated, look on the webpage.  
      4.     Proximity: Throughout the app items that are related to one another are grouped for a better user experience. Items relating to one another are grouped together so               that the user understands they are related. By grouping these items together they become associated with one another by proximity, and the user now interprets them               as a group of items. Items that could once be considered as separate entities are now treated as groups with one another. This helps organize information, reduces               clutter, and provides structure to a webpage. For example, in the app user login and Github login are closely associated with one another, so the user recognizes                 that they are associated with logging in OR creating an account. Furthermore, for updating and deleting items the buttons are associated so that the user                         understands that they both impact the contact entry.
        
