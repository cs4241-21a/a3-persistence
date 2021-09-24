## pogchat.io
Nathan Klingensmith https://a3-iamparadoxdotexe.glitch.me/

My website is a chatroom app that supports sending messages and polls in both a public and private chatroom.

##### *Instructions* 
To enter that chat, create an account with a username and password. Passwords are made secure using [bcrypt's](https://www.npmjs.com/package/bcrypt) salting and hashing algorithm.

Once logged in, you should see the **Public** chatroom with public chat messages from all users.
You can add a new message with the input box at the bottom or create a poll by clicking the poll icon. 
Once you have sent a message or poll, you can edit their content or delete it entirely using the icon buttons located at the top right of the message.
*Note: You can only edit and delete your own messages.*
By using the tabs at the top of the chat box, you can switch to the **Private** chatroom; any messages here can only be seen by you.

##### *Challenges* 
The biggest challenge in realizing this application was adding a private chat where each user could securely access their own MongoDB collection for chat messages and polls.
To make this work, I had to add a `room` variable to each chat-related POST request to identify what room to manipulate data for.
In the case of a "Private" room, the chat collection for the specific user was retrieved via their username.

##### *Authentication*
For authentication, I implemented a username and password form that authenticates user credentials using a hash table stored in MongoDB.
This was the simplest authentication method and what I used in Assignment 2. I also implemented a cookie session to support persistent sessions.

* Utilized [bcrypt](https://www.npmjs.com/package/bcrypt) to salt and hash plaintext passwords for secure storage in MongoDB.
* Added a `/login` POST endpoint for creating a new account or logging into an existing one. A cookie is added to the user's browser to store their username and authentication token.
* Added a `/logout` POST endpoint for clearing the active session.
* Added a `/session` GET endpoint for retrieving the active session.

##### *CSS Framework*
I used [Pico.css](https://picocss.com/) as my chosen CSS framework to revamp my website with better, more uniform styles.

I modified parts of this framework to give my website the exact aesthetic I sought to achieve:
* I restyled radio buttons for polls.
* I reduced padding on input boxes.
* I modified the colors of `secondary` and `contrast` buttons to fit the theme better.
* I reduced margin in places to maintain relational proximity.
* I customized Pico colors and other root variables in `theme.css`.

##### *Express Middleware*
I utilize five different middlewares to improve my Express server:
* `compression` was utilized to compress response data sent to the client.
* `express.static` was implemented to serve static image, style, and script  files from the `/public` folder.
* `express.json` was used to parse JSON request bodies in my POST endpoints.
* `cookie-session` was implemented to store a cookie in the user's browser for persistent authentication.
* `view-helpers` was used to log information on whether my users are using the app from desktop or mobile.

## Technical Achievements
* **Public and Private Data**: Added endpoints for both public data and private, user-specific data.
  - The endpoint `/chat/public` was added to get all chat data for the public chatroom.
  - The endpoint `/chat/private` was added to get all chat data that a user sent in their own, private chatroom.
  - User data was clearly divided in MongoDB through the use of separate collections. For example, a user named "Guest1" would have their own collection created in MongoDB named "Guest1" for storing their private chatroom data. This data can only be retrieved through authentication from the respective endpoint.
* **100% Lighthouse Scores**: Achieved 100% on all four lighthouse tests.
    - I debugged problems with my code until I achieved 100% in all four Lighthouse testing areas: Performance, Accessibility, Best Practices, and SEO. This was confirmed on both `index.html` and `chat.html` (logged out and logged in).
    - Image of inspection: https://gyazo.com/ce13530c51c8a3575bcc19d45eb57ad0

### Design Achievements
* **W3C Accessibility Tips**:  Implemented 12 tips from W3C to improve my website's accessibility.
  - `Provide sufficient contrast between foreground and background` I used white text on a dark purple background to reach a contrast ratio of 8.43:1--surpassing WCAG's recommended contrast ratio of 7:1.
  - `Ensure that form elements include clearly associated labels` To label all form fields, I used descriptive placeholder text like "Write a reply" and "Ask a question" to clearly show the expected behavior of each input. This works well for an interactive chat app like pogchat.io.
  - `Provide clear instructions` In the "Join the chatroom" box, I provide a clear notice that you can either "login to an existing account" or "create a new one" with the same form.
  - `Keep content clear and concise` On all pages, I reduced the content to only what is needed to be as concise as possible. For chat messages, this included showing the user's name, what they said, and when they said it--the three essential pieces of communication.
  - `Provide easily identifiable feedback` In the cases where I need to notify the user of specific events like creating an account or entering a wrong password, I used alert boxes to provide clear, identifiable feedback.
  - `Create designs for different viewport sizes` To ensure users on mobile would have the same functionality as those on desktop, I tested the app at varying mobile screen sizes. Adjustments were made to the CSS using media queries to ensure compatibility.
  - `Include alternative text for images` For the one image on my site that is used to add texture to the background, I actually removed the alternative text to improve accessibility. Since the image provides no new content, but just an aesthetic difference, an alt attribute was not used.
  - `Identify page language and language changes` I specified the English language using `lang="en"` on both of my HTML pages.
  - `Reflect the reading order in the code order` I ensured all of my code follows the natural reading order that is  displayed on the site. For example, messages have a username, content, and then timestamp in that order.
  - `Write code that adapts to the user’s technology` I used media queries to reduce the "pogchat.io" font size and reduce the menu buttons to just icons at small screen sizes.
  - `Ensure that all interactive elements are keyboard accessible` I ensured all elements have a clearly identifiable `:focus` state to support keyboard accessibility on all interactive elements.
  - `Provide meaning for non-standard interactive elements` For all icon buttons, I specified an `aria-label` to provide further meaning. This improved the accessibility for the buttons to add a poll and to edit or delete a message.
