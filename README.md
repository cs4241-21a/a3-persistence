Summary of the application:

the goal of the application
challenges you faced in realizing the application
what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
what CSS framework you used and why
include any modifications to the CSS framework you made via custom CSS you authored
the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for one (and one alone) middleware please add a little more detail about what it does.
The goal of the application is to create a task management tool to add, modify, and delete tasks. The steps are as follows:

I created a MovieHub where users can input movies they would like to see in the future. There is a countdown feature that will let them know when a certain movie will be releasing based on the date they selected.
There are 3 forms for this, the name of the movie, if the movie is streamed online or if its in-person, and the final one is the respective date of the movie. 
If there has been an error when inputting information to the forms and this is prior to submission, please click the edit button to change the availability of the movie. 
If there has been a serious error when inputting information to the forms and you would like to remove this from MovieHub, please click the delete button.
I created the server using express because I found using this inconjunction with MongoDB to work really well. There is a login feature that incorporates GitHub as well, I chose this because it has a lot of versatility and wide use. It seemed like an obvious choice but a difficult one to implement, luckily people have had trouble with this in the past as there is a lot of documentation on routes to tackle this. Besides express I decided to include: cookie session, compression, response time, morgan, and body parser.


Descriptions of middleware:
Simple cookie-based session middleware. A user session can be stored in two main ways with cookies: on the server or on the client.
Returns the compression middleware using the given options. The middleware will attempt to compress response bodies for all request that traverse through the middleware, based on the given options.
Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
This module creates a middleware that records the response time for requests in HTTP servers. The "response time" is defined here as the elapsed time from when a request enters this middleware to when the headers are written out to the client.
Create a new morgan logger middleware function using the given format and options. The format argument may be a string of a predefined name (see below for the names), a string of a format string, or a function that will produce a log entry.
This middleware will never compress responses that include a Cache-Control header with the no-transform directive, as compressing will transform the body.

It was my first time using Bootstrap and it took me a while to get the hang of it if you can call it that. Youtube was extremely helpful in that regard for templating and figuring out scheme designs for orienting the layout.

The main challenge of this would be my mental state, it was extremely difficult to be motivated to work on this project. I had known Lorenzo (the second student this year) and interacted a little with the first student who created the Lego Club on campus. I do not think I would be as affected I am now if I had not had my close friend commit suicide last christmas. Having so many in such a short span of time has really gotten to me and its really debilitating. 
