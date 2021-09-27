## Task List

https://a3-david-mahany.glitch.me

(note: there is almost no security, all data (including passwords for non-GitHub users) are sent and stored in plain text)

![Preview of the main page](demo.png)

- The idea of the app is that you can use it to keep track of a task/todo list (builds on my A2).
  - Each task records the start date and can be assigned a priority which is used to calculate a suggested deadline.
  - The data for users is stored in a mongodb database, where each user is a document containing
    - username (or profile id for GitHub users)
    - password (only for non-GitHub users)
    - an array of task objects containing the data
    
![Preview of the login page](demo2.png)
- I initially went with a simple manual username/password system since it was easy to set up, but in the end I also added the option to sign in with GitHub.
  - As expected, it took some time to get the flow of redirecting to the login page, authenticating, and redirecting to the main page working properly, especially with two modes of login.
- For my CSS framework I chose [Water.css](https://watercss.kognise.dev/), since it looked nice and was very lightweight, meaning I could implement it easily. It also supports using a light/dark theme based on the user's OS/browser settings.
  - Since the framework was on the light side, I still did a lot of the positioning manually using flexboxes.
  - Since I already had it done in A2, I mostly just removed a bunch of the visual stuff like colors and borders I had to let water do most of the work in that area.
  - I did add some additional coloring since it doesn't style the divs/forms by default. I made sure to use water's built in variables for colors though so it matches the light/dark theme.
- The five Express middleware packages I used were:
  - body_parser -- for automatically parsing json in POST requests
  - morgan -- for printing info about every GET/POST request to the server
  - serve-favicon -- for easily serving a favicon
  - passport/passport-github2 -- for GitHub login authentication
  - express-session -- for making/manipulating server-side user sessions

## Technical Achievements
- **Tech Achievement 1**: I used passport and passport-github2 to implement OAuth GitHub sign in.
- **Tech Achievement 2**: Both the login and main page get a 100% in all four lighthouse tests.

### Design/UX Achievements
- N/A
