
## Book Review Page

Shannen Lin: https://a3-sklin330.herokuapp.com/

The goal of the application was to create a two-tier web application with a database, an express server, and a CSS framework. A user should be able to login to a page or create an account if they don't have one. Once logged in, a user can create, remove, and edit book reviews which will show up in a table.

I faced a lot of challenges to realize the application. The challenge that gave me the hardest time was to figure out how to have a user view only their own data and how I would communicate that between the different pages. I also had a hard time figuring out how to design my website to look nice as I don't really have much designing experience. Even with Bootstrap, I still struggled to figure out a good design.

I used server-side authentication with cookies simply because it seemed the easiest and the professor had already provided some sample code to work with.

For my various HTML input elements, I used text area, text field, password, and number inputs in my forms.

I used the Bootstrap CSS framework because it is very easy to use Bootstraps predefined design templates. It really helped with keeping my designs consistent across different browsers. I made a few changes to the CSS. For example, Bootstrap only has 25%, 50%, 75%, and 100% for setting the width but I wanted a value of 30%. Also, the way that Bootstrap handled tables did not work with the way I had set up my code so I added my own CSS code for that.

The 5 Express middleware packages I used were: `body-parser` which parses the incoming request bodies before the handlers and puts them inside request.body, `cookie-session` which stores the session data on the client within a cookie and was used for authentication, `serve-favicon` which allows us to serve favicons from the node js server with better performance, `serve-static` which is used to serve static files from within a given root directory, and `morgan` which logs information for HTTP requests.

## Technical Achievements
- **Tech Achievement 1**: I hosted my site on Heroku. I really like the site because unlike Glitch, I don't have to wait for a while for the site to wake up. However, having to install the Heroku CLI to set up the site was a bit more inconvenient compared to Glitch.

### Design/Evaluation Achievements
- **Design Achievement 1**: I used the 4 design principles from the Non-Designer's Design Book readings.
The principle of proximity involves grouping related items together into a visual unit. I have a few examples of proximity on my site. On my login page, all the related items(username input, password input, Submit and Create an Account) are all very close together in the same box to indicate that they are related to each other. Once logged in, my main page is divided into 3 distinct sections: the header which includes the title, the Add Review form which contains all the information needed to add a book review, and the results table which contains all the information about the added book reviews
