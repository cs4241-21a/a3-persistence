## Procrast-inator

https://a3-ryan-stebe.herokuapp.com/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

Procrast-inator is an application that schedules a user's given tasks for as late as humanly possible, sometimes inhumanely possible.

In realizing the application, I had a lot of trouble getting the login system to work, and I ended up needing both an intercepting express middleware, and a separate login post request handler (and a very simple logout handler). The redirection had a lot of issues with infinite redirection, which I was able to solve by only redirecting when loading POST requests other than /login and GET requests to html pages other than /login.html.

I chose to simply use a password that is entered in the login/registration form and saved to a session cookie along with the username because I did not feel like spending the effort to learn OAuth authentication with my current workload.

I used the materialize CSS framework, as I am decently familiar with it from using it for my IQP Project, although I did need to look up the documentation as a refresher, and to find components that were useful for this assignment that I hadn't touched before, such as the tables and forms. I did not modify the CSS framework.

The express middlewares that I used were the following:
I used express.json to automatically convert the body of post requests into JS objects.
I used express.urlencoded with extended set to true to help with the login form.
I used cookie-session to utilize a cookie for storing the username and password that a user last logged in as.
I used a custom middleware that checks if the user is making a non /login post request or a get request for an html file other than login.html, and if so redirects them to the login page if they are not already logged in according to the session cookie.
Lastly, I used express.static to serve the html, css, and js files that are visited or linked to.

As a quick note, the application can give a performance rating on lighthouse of around 80-something if the heroku app is starting up when you run the report, however when it is already running, it is much more performant. This should be pretty similar to how Glitch works, but I wanted to make sure I don't lose points over it.

## Technical Achievements
- **Tech Achievement 1**: (5 pts) Instead of Glitch, I hosted my site on Heroku. The process for integrating Heroku with a gitHub repository was very simple and useful, especially the automatic build deployment, and environment variables were easy to set up. Overall it felt like it was more complete than glitch in terms of functionality and utility, and its only downsides that I noticed was that the deployment process takes a little bit, and you need to make changes to version control to test the application on Heroku. Both of these downsides however were effectively present in Glitch as well, as Glitch was even more tedious to upload changes from a repository, and although it lets you make quick changes while heroku doesn't, it is harder to move those changes back into the repository and keep track of what changes were made in Glitch for when you have found a solution to a bug. The only unique flaw with Heroku with respect to Glitch is that it has some sort of CLI version that wasn't using that makes it difficult to search for answers to problems on the internet as most answers gave a command to run, which I don't believe is possible to do from the web application.

- **Tech Achievement 2**: (5 pts) Arguably I did not finish this achievement, but I have gotten a score of 99% performance, 100% Accessability, 100% Best Practices, and 100% SEO on both pages of my application. With performance, I was very close, the only option left to improvement seemed to be cutting down on the unnecessary css, js, and icons that are being sent over from google fonts and my CSS framework, materialize. Not only would this involve combing over 10,000 lines of code to find which parts can be cut, but when I tried to move the materialize library onto the server it turns out it got slower to load because the source I was importing it from was automatically compressing the file, and my server was not. While the second problem could probably be solved with some express middleware, the first is impossible to do within the timeframe of the assignment and would only offer a very slight increase in performance, so it would not be a worthwhile optimization outside of an assignment either.

### Design/Evaluation Achievements
- **No Design/Evaluation Achievements**