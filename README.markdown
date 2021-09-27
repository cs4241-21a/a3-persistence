Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 20th, by 11:59 AM.


## Car Value Generator


https://a3-ashwin-pai.glitch.me --> Link to Glitch Hosted Site

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

The goal of this application was to create a "Car Value" based on the properties of a users car. The primary factors are the number of repairs, 
the number of miles drive, the age, and the price at which it was purchased. One of the challeges I faced was creating a mathmatical equation that represented the "estimated value"
With regards to the authenication I used a simple basic authentication with just a username and password simply because it was easy and it wwas my first time
attempting auth. The CSS framework I used was bulma, I chose it because it is lightweight, and very simple to use. I primarily used it on the loggedIn.html page. 
The 5 middleware packages I used: 
  1. body-parser --> responsible for handling server requests as JSON object (as opposed to something else)
  2. serve-static --> responsible for serving static files via a specified directory
  3. cookie-session --> responsible for maintaing the cookies for a browser request to help keep track of which user has logged into a session
  4. connect-timeout --> responsible for creating a timeout protocol for HTTP requests that are taking too long, this can help alert the user/update the screen
                        if the request is not being processed in timely manner. 
  5.morgan --> responsible for processing HTTP requests and printing out associated information for them in the console. Made it eeasier to see what requests wrere coming in. 

Other Notes: 
I was unable to get the modify function to work properly. 
However, the delete and add work as intended. When using the delete please make sure to only delete one at a time. 

USER LOGIN INFORMATION: (Super Secure)
UN: testUser PW: password
UN: testUser2 PW: passwword

## Technical Achievements
- **Tech Achievement 1**: Acheived 100 percent on LightHouse Test ![Image](https://cdn.glitch.com/b751e637-8e58-4159-8392-e8bbf08d74d6%2Fa91858e7-f548-4ca6-ae7d-b633a27abff5.image.png?v=1632758236675)

### Design/Evaluation Achievements
