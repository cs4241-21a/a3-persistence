Assignment 3
Michael Rossetti

http://a3-mfrossetti.glitch.me

The goals of the project were to further the driver database from my project 2
and work to make the information stored on a server. It was also to use
an express server. Throughout the assignment I faced a lot of difficulty in first
getting the table to work with new value, and was unfortunatly not able to
implment a proper version of modify (although my code is still in there). I was
however able to get the delete function to work. I stuggled at first getting the server
to work with all of the pages, and was only unable to get my logout button
to work properly. It ends the current user, but does not redirect to a new page.

I used the css framework awsm.min because i liked the minimilaist style of the design.
The only thing I changed with this file was increasing the margins.

Express Middleware:

1. body-parser: uses the req.body property to get information from the incoming bodies
2. morgan: it creates a logger for http requests: i used the tiny/short form
3. connect-timeout: it will create a time out request if middleware takes over a given set of time
4. helmet: it sets HTTP headers to increase security
5. response-time: records the response time for http requests
