Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## BoarderLine
Server link: https://salty-ridge-71972.herokuapp.com/

The idea of this application is a quick and easy way to write and review small text blurbs. Write small notes and share with others who can write comments about it! 

Originally, I wanted to make something like google docs that would allow people to share small bits of text and review it with others. The real-time connection to have multiple people editing a document seemed out of the scope of this project so I scaled back to just having one owner with many reviewers. 

Some major challenges that I faced when writing this application:
- Unable to use the mongodb connection through WSL (had to develop in Windows)
- Cookie Max age is in ms (I had it set to 60000 which only lasted a minute and was really confusing)
- Styling in general is pretty difficult to make things look good
- Logging out from the github auth required an extra step to destroy the user's session and not just logout
- I had been very used to relational databases before this, so I kept thinking about things using joins/foreign keys which don't exist. Instead, every document can just store the information it needs

## Technical Achievements
- **Authentication**: I used OAuth authentication via passport and the GitHub strategy
- **Express Server**: Created a RESTful API with express to manage the data
- **MongoDB Connection**: Connected the application with mongodb to host the data 
- **Express Middleware**: Passport, Body-parser, Session, Static Server, View Engine
- **Hosting on Heroku**: Hosted the Node application on Heroku. This was much nicer than using glitch because it has a command line tool which can link directly to the code I have on my machine rather than having to import it from github everytime (it is pretty similar, but the flow in heroku is a bit nicer). 

### Design/Evaluation Achievements
- **Lighthouse Tests**: Fixed code to ensure all lighthouse tests pass at 100%
![lighthouse test 1](/img/passing-lighthouse.png)
![lighthouse test 2](/img/passing-lighthouse2.png)
- **View Engine EJS**: Used a view engine to render the pages with some context. This could still be improved upon to make dynamic pages based on the user's priveleges
- **Bootstrap CSS**: Included the bootstrap framework to make the grid styling 'easier'. 