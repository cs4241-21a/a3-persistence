## Flight Reminder

App link: [https://flight.penguinmuseum.com](https://flight.penguinmuseum.com)
Note: if edit button does not show up due to js cache problem, please use incongnito window.

The project demonstrates on flight information record. Many people may book the flights from different flight companies/platforms, which they may or may not to remember or hard to track all the flight information. This app will allow users to record the flight information include their flight number, departure & arrival airport, and the date; then the app will sort the flight information into upcoming trips and past trips. User can either created their own username and password or choose to link their their github account; also, all the data is permanently stored in the Mongodb. Users should be able to add, edit and delete the data. 

# CSS Framework used: water.css
# Middleware packages used in this project: 
- Body-parser: parse HTTP request body
- Cookie-parser: parse cookie header adn populate req.cookies
- Session: establish server-based sessions
- passport: Authenication using OAuth (github here)
- mongoose: connect mongodb

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. 
- **Tech Achievement 2**: I deployed to DigitalOcean. 
  I found my application does not work, and it seems there's an issue associated with dependencies.  However, the log provided by Heroku was unclear.  In order to figure out the fundamental causes, I switched to DigitalOcean where an dedicated vps provides the flexibility and can interact with the console.  In the end I found it was because of the version of Node.js required by Mongoose higher from the current -- I updated the Node.js with apt-get, and it then works.
### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
  1. Provide informative, unique page titles
  2. Use headings to convey meaning and structure (demonstrate on index.html)
  3. Provide clear instructions (tell what users to fill in for the flight info)
  4. Keep content clear and concise (no long sentence, only short phrase)
  5. Make link text meaningful (logout)
  6. Provide suffiecient contrast between foreground and background (modify the light mode)
  7. Ensure that form elemnts include clearly assoicated labels
  8. Ensure that interactive elements are easy to identify (buttons, re-direct links)
  9. Identify page language and language change
  10. Associate a lbel with every form control
  11. Help users avoid and correct mistakes
  12. Reflect the reading order in the code order
