CS 4241 Assignment 3: Persistence

Winnie Ly

This project focuses on using a database (MongoDB) to persist data from an authenicated user that logs in with a specific username and password. 

The part I struggled the most was thinking and planning about the linking between the authenicated user to the associated data that should show up in the table. 

The authenicated strategy that I used was that I created another collection in MongoDB that stores usernames and passwords and in the main collection would have an element that contains the authenicated username with each document. From this, each query pertains to a specific user from their username.

The five middleware that I used:
- body-parser, responsible for parsing the incoming request body before it is handled
- morgan, shows a log of HTTP requests
- response-time, records the HTTP response time
- connect-timeout, setting a timeout period for HTTP request preocessing
- cookie-parser, parses the cookie header and populate the req.cookies field.

Design/UX Acheivements:

- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
Which element received the most emphasis (contrast) on each page? 
How did you use proximity to organize the visual information on your page? 
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 
How did you use alignment to organize information and/or increase contrast for particular elements. 
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 
