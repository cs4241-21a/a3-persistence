## Online Food Orderer Definitive Edition

Jack Campanale https://a3-jcampanale.herokuapp.com/

## Goal
This application allows people to order food for delivery from a new and upcoming chain restaurant, Mendy's. Users are required to log in 
prior to placing an order, or create an account if they have not done so. They can then see any orders they have place previously as well
as place new orders. Users are allowed to remove any past orders they've had as well as update orders as well if they have selected something wrong.

## Challenges
The main challenges I faced setting up this application was with the login page and cookies for users, I struggled to make the cookies work
which was what allowed me to gather previous data the user entered and I was unable to work with OAuth for the technical achievement.

## Authentication Strategy
I used cookie parser as one of my middlewares which allowed me to post data using userid as a cookie value and fetch it later on when users log in using post methods in my server.

## CSS Framework
I used the Bootstrap Framework for my login page which made the UI design a lot more simple than when I had designed my main page.

## Middleware
- **static**: Serves static files from my 'public' directory like any JS or CSS files
- **body-parser**: Parses request bodys automatically without any manual code
- **urlencoded**: Based on body-parser, parses request bodys with urlencoded payloads, allowing forms to be parsed easily
- **json**: Based on body-parser, parses JSON request bodys automatically
- **cookie-parser**: Based on body-parser, parses user cookies to easily store data for each client

## Technical Achievements
- **Tech Achievement 1**: I hosted my site on Heroku

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
    - **Provide informative, unique page titles**: I titled my Login and Main pages with unique starting titles, and the same subtitle "Mendy's Delivery" to inform they are on the same site.
    - **Use headings to convery meaning and structure**: I use headings on both my Login and Main pages to separate sections of the login forms and order submission forms to convey to the user what to submit and where.
    - **Provide clear instructions**: On my main page, if users leave either the name or order field blank I have alerts pop up explaining to them to not leave that field blank.
    - **Provide sufficient contrast between foreground and background**: I checked on lighthouse for both my login page and main page that they both passed for proper contrast and adjusted colors when needed, the submit button on my main page used to have black text but now it has white text for sufficient contrast.
    - **Ensure that form elements include clearly associated labels**: For every form element in my application I've included a placeholder to convey what is supposed to go in the form elements, as well as header labels on my main page.
    - **Provide easily identifiable feedback**:  On my main page, if users leave either the name or order field blank I have alerts pop up explaining to them to not leave that field blank.
    - **Include alternative text for images**: I included alt="Mendy's logo" for both instances the logo for my application appeared.
    - **Identify page language and language changes**: I included the primary language lang="en" in my html tags.
    - **Reflect the reading order in the code order**: I ordered my website such that on the login page, previous users will be able to log in quickly and new users will see that they need an account to login so they will go down to the create an account form. I ordered the main page such that adding a new item is towards the top of the page with the previously placed orders towards the bottom.
    - **Write code that adapts to the user's technology**: I included "<meta name="viewport" content="width=device-width, initial-scale=1.0">" in both my main and login pages such that the application would adjust automatically if the user is on mobile or desktop.
    - **Help users avoid and correct mistakes**: On my main page, I included directions for how far each distance correlates to.
    - **Use headings and spacing to group related content**: On both the main page and login page, I separated all the form sections using headers and spacing to show which header corresponded to which form input. 