## Persistent Colorful Notes

URL: a3.edit2013.com

- The goal of this application is to allow users to save notes to themselves in a colorful way. The color dictates how the message is displayed
- The primary challenge was getting MS auth set up, as well as time management. 
- I chose Microsoft's authentication library because I knew everyone had a Microsoft account and I wanted to play around with it
- I used the water.css framework for everything except the messages
  - I had to adjust the body alignement
  - The message formatting is also custom
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.
    - Express static: returns static pages
    - Cookie Parser: parses the cookies for authentication
    - morgan: logs access requests for all HTTP requests
    - passport: for MSAL authentication
    - Express json: for parsing the JSON

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the Microsoft Authentication Library with Passport.js
- **Tech Achievement 2**: I am hosting this website on my own Ubuntu server, with PM2 to manage the processes
