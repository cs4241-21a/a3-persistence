Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Simon Says

https://a3-garrett-sheehan.herokuapp.com

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- My goal for the application was to create a simple game with a leaderboard that updates in real-time.
- I faced a lot of struggles with this project. Among the most prominient were figuring out how to effectively use mongodb, wrapping my head around a login system, and resolving the way promises and data were passed between the client and the server.
- I chose to use a list of objects in a collection for my login strategy. Within these objects are the name, password, score, and rank of the user on the leaderboard.The username of the current logged in user is saved as a cookie for future reference. I chose this because it seemed reliable and was easier to understand.
- I decided to use NES.css since I was making a game and thought the aesthetic would fit my project.
- My five middleware:
- Express: Self-explanatory, enables express to work.
- Cookie-session: enables me to store login information as cookes in the server side for future reference.
- MongoDB: enables me to use the MongoDB database system within my project.
- bodyParser - allowed me to parse the bodies of various HTTP requests
- Morgan - Enables me to log my HTTP requests for ease of tracking.

## Technical Achievements
- **Tech Achievement 1**: 
- I used Heroku to host my website for this project. It was a bit challenging as I had to debug a few issues on the command line, but I was able to get it working without too many problems. It is considerably faster than Glitch though, making me likely to prefer it when developing web apps in the future. It was definitely worth the steeper learning curve.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative. These tips include:
- Associating a label with every form control
- Identifying page language (might be cheap)
- Using mark-up to convey meaning and structure
- Providing clear instructions
- Providing easily identifiable feedback (might overlap with above)
- Keeping content clear and consise (might be cheap)
- Providing sufficient contrast between foreground and background
- Don't use color alone to convey information
- Ensure that interactive elements are easy to identify
- Provide clear and consistent navigation options (might overlap with below)
- Ensure that form elements include clearly associated labels
- Use headings and spacing to group related content
