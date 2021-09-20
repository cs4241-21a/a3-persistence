Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
---

## Your Web Application Title

Heroku link: https://contact-log.herokuapp.com/

The application is a simple contact logging system for users. This can be used for contact tracing, possibly for COVID, or for keeping an upto data list of personal or work related connections. The app implements a MongoDB server for user creation and data storage. HTML, and JS were used in unison to build a responsive database system. For CSS, a common framework, called Bulma, was implemented for all the basic needs. Bulma is a free framework with tons of common CSS features, such as Cards and Modal screens. Custom CSS was added to implement the proper Fonts and spacing required for the interface. Furthermore, custom CSS was used to implement a counter for textarea inputs. To run the server, Node, Express and common middlewares were used for development. Some challenges faced during development were launching the app on Heroku, and creating a user registration system. The authentication strategy chosen was a simple Username + Password system. This type of authentitication is common accross majority of applications. The website recieved over 90% for each Google Lighthouse test.

![Login Page](https://user-images.githubusercontent.com/62816869/133960311-bd836925-5e21-4af7-969c-cd6d944f8381.JPG)
![Main Page](https://user-images.githubusercontent.com/62816869/133960248-62f4ea72-c505-48d7-8157-afe96c22caac.JPG)


The five middlewares used are:
1. body-parser -> Allows parsing JSON data into the request body.
2. cookie-session -> Allows the use of cookies to store data.
3. cookie-parser -> Allows the ability to parse, and print the cookie data
4. express.static() -> Allows the express server to serve static files in the pubilc folder.
5. A custom middlware that automatically logs in users that have already signed into the website. It redirects the user to the contact list page if the user is logged in.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I used Heroku to host the website instead of Glitch.

### Design/Evaluation Achievements
- **Design Achievement 1**: Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings.
      1. Contrast: For contrast I made sure that all colors contrasted eachother as much as possible. This allowed aspects of the webpage to be much more visible, and pop out            more for the viewer. For example, the white card color contrasts the green color of the main body on the login page. Furthermore, the table in the main page has black            text, on a white background, which is as much contrast as possible.
