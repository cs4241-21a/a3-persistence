## Pet Gallery

Glitch: https://a3-kiara-munz.glitch.me
Code: https://glitch.com/edit/#!/a3-kiara-munz

**Summary**

Pet Gallery is a simple application to view images of your pets! Submit a link to any image and see it clear as day! Underneath the image will be a randomized tag line for your critter. Currently only explicitly supports Dog, Cats, Birds, and Snakes, the site also allows of "Other" pets with their own more generic tag lines.
![Image of Pet Gallery Page](https://i.imgur.com/R2tJuxd.png)

**Challenges**
The first challenge I faced was converting my non express server to an express server. Particularily, the get and post requests. Previously, I had not need to include "headers:{ "Content-Type": "application/json" }," so silent falling request drove me a little insane for a while.
My next real challenge was working with cookies. I have never had to use them before and it took a while to adjust. It took a while to figure out my default pet data insert statements werent working because i was wrapping an ObjectId object in another ObjectId. Once those kinks were worked out, I reformatted my code and suddenly nothing seemed to work! Turns out the browser I am using, Opera, suddenly decided I was saving cookies too often on one site. Once I switched over to Edge for live testing (and repaired all my debug "fixes"), cookeis were back up an running!

**Authentication**
This website is autheticated with a simple login form, cookies, and a mongodb collection. The user inputs their username and password, which sends to the database to check the validity. If the entry exists in the users table, the user will recieve their id in the cookie session and move onto the main page. The main gallery uses their stashed cookie id to submit new pets to the gallery and note their owner. This way of authenticationg was relitivaly easy and straight forward. Additionally, my mongodb-santitize middleware will also ensure this method of authentication will be mostly safe.

**CSS**
I used the pico.css framework. I liked it because it was easy to install and has a dark/light mode built in. It, also, automatically works on my phone. I modified some CSS for centering formatting and to add the flexbox formatting, as well as some sass changes for color contrast.

**Middleware**

- serve-favicon: provides a favicon for the page. mine is a cat emoji.
- body-parser: parses request body strings to json
- cookie-session: enables cookie storage to save login information
- mongodb-sanitize: cleans requests to prevent sql injection attacks to mongodb
- custom: I also created a function to ensure unauthenticated cookie users were redirected back to the login page. It is place after all the login auth code to ensure these legitmate authentication requests are not skipped. It checks that the request isnt a /login request within the body aswell to doubly ensure this. I was having issues with css files loading, so the middleware also ensures not to skip any of my css files. If the user does have cookies or is not making a request that doesnt require authentication, the middleware just goes next(). Otherwise it re-sends the login file to further prompt the user.

## Technical Achievements

- **Tech Achievement 1**: I got 100% on light house! This is mostly thanks too [uploadcare](https://uploadcare.com/docs/delivery/adaptive-delivery/)! Very helpful for image optimization.
  ![Image of 100 on lighthouse](https://i.imgur.com/gGkOy7N.png)
- **Tech Achievement 2**: (5 Points) I used Sass for the first time! Even tho this is not in the tech achievements officially, it definitely took some work on my part. I chose to use pico.css as my css framework, but when I found out that the color contrast on the blue theme was too low, I wanted to switch to the pink theme. I did not know how to modify this template at all! I looked in the docs and fi8gured out I had to use Sass. Sass (or Syntactically Awesome Style Sheets) is a css extension language that more elegantly handles variable names (among other things) in css. I installed sass with npm and starting working on hooking everything up. After some complaining about unknown directories and the location of pico.css, I now have a sass compiled pink theme for pico.css! I also hunted through the pico defined variables to modify grey-500, which controls the muted colors, so I can switch it to be the same as the normal text to keep good contrast accross the site.

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative

  - Writing:

    1. Provide Informative and Unique Page Titles: I added the title 'Login | Pet Gallery | CS4241 A3' to the login page and 'Pet Gallery | CS4241 A3' to the main page. I could have added another title qualifier to the main page, but I believe it would just be repetitive as that pages purpose is described with "Pet Gallery"
    2. Write meaningful text alternatives for images: I added an alttext to all the images in the pet gallery: "Picture of a TYPE named NAME." I also added a ternary operator inline check to change this alternative text to read "Picture of a Pet named NAME" if the pet species is "Other" to make this text easier to understand.
    3. Provide Clear Instructions: I added a paragraph at the top of the pet gallery page that provides basic instructions on how to use the site. It reads:

    > Add pets to your gallery by inputing their name, a link to an image of them, and their species below!<br>
    > Edit and delete any pet by using their corresponding buttons.

    4. Keep Content Clear and Concise: I added clarification to the sign-in page. Now it reads:

    > You will be redirected to Pet Gallery once you <br> > <b>Sign-In</b> with your username or <b>Register</b> with an unused username below!

    instead of:

    > Login with a pre-existing user name and password or <br>
    > Automatically create a new account by signing in with a new username + password!

    This puts the instructions in laymans terms while also adding clarity to what will happen next. It also adds empahsis to the two methods by bolding the words and seperating it from the redirection information. It is shorter and clearer than before!

  - Designing:
    1. Provide sufficient contrast between foreground and background: Turns out the default button color for pico.css does not provide enough contrast with its white text, along with captions being too light gray for white backgrounds! I have re-color schemed the page to the pink theme over the blue theme to provide 4.5+ contrast ratios to all elements and changed the figcaption text to the same grey as the rest of the text.
    2. Ensure that interactive elements are easy to identify: I added a tooltip to the Image Link label on the main page to give the user clearer information on what image links will be optimized. To make sure it is clearly hihglighted, I wrapped it in an emphasis tag.
    3. Ensure that form elements include clearly associated labels: Previously, I did not have labels associated with the username and password field of the sign-in page. This has been fixed!
    4. Provide easily identifiable feedback: Previosuly, whenever any query has an error, the user had no information on what went wrong. It would just look like the screen refreshed. Now, a paragraph will notify the user of an error and the instructions to perhaps try again later. On main html, i used an empty paragraph with id=error for where errors will go if they are found. The easiest error to test is if the names of the pets are an empty string. This will tell the user "Error: Oops! One of your create or update inputs was an empty string! Please use at least one character for names and links." This is much clearer than before.
  - Developing:
    1. Associate a label with every form control: As mentioned, the login-in form previously did not have any labels, and now it does!
    2. Include alternative text for images: I added alternative text for every gallery image.
    3. Identify page language and language changes: I added lang="en" to the top of both the main page and the login page.
    4. Help users avoid and correct mistakes: Previously, on failed login, the user will simply be redirected to the login page. This is not clear to what the user did wrong, so they wont be able to correct it. I have added a loginFailed.html page which has error information in a pargraph and highlighted username and password fields.
    5. Reflect the reading order in the code order: I reorganized my code to have the logical structure of setup -> login -> get -> create -> delete
