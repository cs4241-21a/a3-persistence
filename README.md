## Event Itinerary
https://a3-nicholas-frangie.herokuapp.com/

This application serves as an Event Itinerary for users, storing event information such as the event name, date, time, and whether attendance is mandatory.

Significant challenges faced while realizing this application included alerting the user of newly created or incorrect passwords. Because User Authentication is handled server side, signaling a client-side JavaScript function to alert them turned out to be very difficult. Ultimately, this was resolved with a short-term cookie that could be used to pickup and relay alerts to the user via the alerts.js script.

I chose to authenticate with a cookie-based session system. Usernames and passwords are regrettably stored in plain text in special a mongoDB collection that the server selects as it's default when no accounts are logged in. Logging in successfully into a registered or new account prompts the server to change it's current collection, which allows the data relevant to that user to be served.

I used a Normalize (CSS Reset) and Bootstrap framework because of it's robust documentation and demo material. It made unique styles and tools readily available to me, and made the process of styling the site a lot simpler. The few modifications I made to the framework included specifically styled components for the login page and styles for footers and icons.

Express middleware:
- cookie-parser, which allowed me to parse and read cookies from the user's session.
- serve-static, which serves static files from the public repo to the user without me having to manually setup every one.
- serve-favicon, which allowed me to serve a custom favicon for my site to give it extra polish.
- body-parser, which simplified the process of converting 'application/json' Content-Type requests to json.
- A custom middleware responsible for redirecting and authenticating users. This was accomplished by reading the uid cookie passed alongside the request; requests without the relevant cookie will be redirected to the login page, while those which pass the middleware check resume without issue.

## Technical Achievements
- **Heroku Deployment**: Honestly this was the easiest part of the assignment. Deploying through Heroku toom me less time and hassle then Glitch. I didn't have to spend 10 minutes scouring for the rename project functionality like I do with Glitch. GitHub importing was seamless and quick. The only thing that may be worse about it is the lack of project templates for starting new projects, but I didn't work from Heroku in the beginning, so I can't be sure about that.

### Design/Evaluation Achievements
- **100% Lighthouse**: [100% Lighthouse ratings achieved for all 4 categories on desktop mode](meta/lighthouse-report.png), as detailed per this assignment
- **12 Tips of Accessiblity**:
1. *Associate a label with every form control*: Every form-control on the site has an attached form label, which is essential for screen-reader purposes. Although it may not appear like it, hidden form labels are present on the login page which allow for screen-reader functionality to be preserved even on the minimalized page format.
2. *Identify page language and language changes*: The primary language of each html page is detailed as "en" in the lang attribute.
3. *Ensure that all interactive elements are keyboard accessible*: The entirity of the page can be interacted with via keyboard. Autofocus is configured for ease of access on loggin in.
4. *Provide sufficient contrast between foreground and background*: A black and white color scheme was chosen for major page elements that guarantees a high contrast.
5. *Ensure that interactive elements are easy to identify*: Interactive elements responsd to receiving focus. Interactive hyperlinks change color and are underlined consistently in all places on the webpage: buttons and the custom-made icons receive a custom made on hover functionality that acts to reveal they are clickable. The custom-made icon buttons also receive an outline for keyboard-bound focus.
6. *Ensure that form elements include clearly associated labels*: The form elements of the main page form have clearly labeled and directly corresponding labels for every input field.
7. *Provide easily identifiable feedback*: Users are alerted when a failed password is submitted on an attempted login. Users are also alerted when a new user account has been created, and the username for that account is relayed to them.
8. *Use headings and spacing to group related content*: Whitespace and proximity is used to make relationships between content more apparent. Care was made to ensure the two primary components of the main page (table & form) were spaced so that they are observably distinct. Each group of related content has a leading form header.
9. *Provide informative, unique page titles*: The pages of the website are titled "User Authentication" and "Event Itinerary". These names are self-descriptive, distinct, and unique to the content they contain.
10. *Make link text meaningful*: The links on the primary page all clearly convey what content they link to. The logout link signs the user out. The credit to Kiranshastry for icon creation leads to his user profile; likewise, the link to flaticon.com leads to www.flaticon.com.
11. *Use headings to convey meaning and structure*: Each content block is preceded by a header that accurately and specifically relates to the context and meaning of the section.
12. *Write code that adapts to the user’s technology*: Used the device-aware bootstrap flexbox classes such as col-sm-4. These classes automatically adjust under the programmer's specifications to resize and reorganize content based on the user's devices, allowing for consistent viewing across desktop and mobile configurations. Additionally care was taken to limit the horizontal scrolling on the page.
