## WPI Computer Science SA, TA, and GLA Tracking Sheet V2

Server link e.g. https://a3-christopher-vieira.herokuapp.com/


### Application Goal:
The goal of this application is to provide a logging sheet for computer science department SAs, TAs, and GLAs. It stores information about them such as their name, class they are course staff for, hours worked a week, and more. 

### Challenges Faced:
The main challenge I faced is I tried to front load this assignment. I had to teach myself about the concepts of async functions and await, I didn't realize it was going to be covered during lecture. Another challenge was completing the OAuth section for Github. The difficulty wasn't getting the code for it, it was more so ordering the code in the correct order. One issue I had was the get requests being routed through the wrong area which prevented my login checks from occurring. 

### Authentication Strategy:
The authentication strategy I chose was using Github Authentication. First off, I found it most interesting to do. Conceptually, I understand the idea of maintaining a separate collection in mongodb which stores user information, account creation, and tracking what user is connected to what data. What I didn't know of was OAuth itself. I attended a workshop for it last year so I was already interested in implementing it. The extra credit also was a good incentive. Once I started, it also became apparent that OAuth was the easier option in terms of the amount of work. It just requires a lot less tedious actions to be completed. Lastly, with job application season approaching, this is something I wanted to put on my resume. 

### CSS Framework
The CSS Framework I chose was Material Design. Given my application's focus on a main central table, I wanted something that made the tables look a lot cleaner. This did exactly that, in my opinion it makes it look more professional and doesn't strain the eyes with all the annoying little borders. Once I had done this, I tried as best I could to copy everything the WPI website uses. My project is based on a CS Department group so I wanted to try to incorporate as many fonts, colors, and other styling choices that I could into my application from them. I actually used all of the same rgb values that I found on their website, it's the justification I have for using so many colors (as they should have been chosen by a proper graphic designer).

### Express Middleware:
I used the following packages or methods as express middleware:
- All post and get requests were done through app.get() and app.post(). This allowed for easier routing
- I used app.use(express.json()); to automatically convert incoming requests into json.
- I used app.use(morgan("combined")); to log every request sent to the server.
- I used app.use(cors()); to enable cors to be used. 
- I used app.use(session({...})) to create a session to track which user is interacting with the web application.
- I used app.use(passport.initialize()); to initialize the passport used for OAuth.
- I used app.use(passport.session()); to create a passport session to allow for OAuth functionality.
- I used const userIsAuthorized = (req, res, next) => {...} as a custom middleware function that checked if a user was authorized or not. It would redirect them if they weren't to protect the data page from anyone trying to hardcore the link. It did this by checking the request body tag's user field. 
- I used app.use(timeout("5s")); and app.use(haltOnTimedout); to set a 5 second timeout for any action sent the server. 
- I used app.use(express.static("public")); to allow access to the javascript, css, and image files without specific and annoying routing being necessary.



## Technical Achievements
- **Tech Achievement 1** (10 points): I used OAuth authentication via the GitHub strategy
- **Tech Achievement 2** (5 points): I hosted my site through Heroku. I chose to do this as Heroku gives you more controls and services, one highlight being the automatic redeploy when information is pushed to a Github branch. It doesn't make it practical enough to develop on, though it is incredibly useful to transfer from a local environment to the server itself. 
- **Tech Achievement 3** (5 points): I got 100% on all four lighthouse metrics on my first page and my second page. See the images folder in order to see the screen captures of this.  

### Design/Evaluation Achievements
- **Design Achievements**: None because I couldn't get any points from doing this and I'm happy with how things came out.
