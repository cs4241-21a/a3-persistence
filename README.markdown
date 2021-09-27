Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Task Management Application

http://a3-rvyan2023.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

The goal of the application is to create a task management tool to add, modify, and delete tasks. The steps are as follows:
1. To add a task, fill in all three fields and submit.

2. To modify a task, click on the modfiy button for the specific row you want to change. Then, type in the new priority or due date and then click submit.

3. To delete a task, click the delete button on the desired row you want to move.

In addition, I connected my website where it uses the Express middlewhere to connect to the MongoDB where it collects data for the associated tasks and the associated GitHub user. Each user can only see their own list of tasks.
Here is the link: https://cloud.mongodb.com/v2/5eac7e59f386911f8233df59#metrics/replicaSet/6141599a37a2a33e19bf88f8/explorer/Assignment3.
There is also a screenshot of the MongoDB site in my assets as well.

The five expressions I used are as follows. The first is cookie session where it accepts cookie-based sessions.
The second is body parser where it passes HTTP request bodies. The third is compression where it compresses HTTP responses.
The fourth is morgan where it deals with the HTTP request logger. The fifth is response time where it handles the HTTP response time.

The CSS framework I used was the Boostrap framework because I wanted to use horizontal form for the buttons. I used three classes that were form-horizontal, form-group, and form-control.

The authentication strategy I used was the GitHub authentication. The reason I chose this strategy
was because there was enough documentation to study and learn.  Also there were many examples and tutorials that made it easier and clearer to follow. 

The main challenge was implementing the GitHub authentication part. I tried numerous ways and did vast testing to work towards the challenge at hand. It took substantial time to learn and implement. 

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy


### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the CRAP principles from the previously signed reading.
The first principle I followed was contrast. 
On my webpage I contrasted the colors of the title and the directions. 
This is a subtle difference to distinguish between the title of the website and the directions that need to be followed. 
In addition to the contrast of the color, I contrasted the size of the font to also further distinguish between the title and the directions. 
The title is larger so it attracts the user’s eye right away and then they migrate their sight down to the directions with the smaller font. The second principle I followed was repetition. 
The repetition element I used in my website application was the centered alignment. The centered alignment is used for the website title, website instructions, and website picture. 
The third principle was alignment. As I mentioned in the second principle, I used the centered alignment. This helped me organize the task management sections into one, clear section together. 
The fourth principle I used in my application was proximity. For proximity, I grouped together the title, directions, and picture because they directly related to each other. 
The GitHub login button is farther away in proximity because it is not directly related, signifying a separate part of the application.
