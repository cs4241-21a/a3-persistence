README
---

## https://a3-harrison-kyriacou.herokuapp.com/index.html

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- In this application I made a financial portfolio tracker
    - This app aims to provide a place where users can keep track of all their assets, no matter if they are in many different accounts
- I ran into several challenges while implementing logic for making dynamic tables based on the users asset list
    - I had worked through these challenges in A2 but implementing a MongoDB made it less straight forward, and I wanted to make it better
    - In order to do this, I tried JQuery and was able to make cleaner and more readable code that populated the tables
- I used cookie based authentication because I am learning about cookies in my Network Security class right now so I though it would be interesting to learn about them from a more development side than a security side
- I chose the MVP.css framework because I liked the simplicity of it and it was easily implemented
    - It is not class based, and just provides styling onto basic HTML nodes
    - The only change I made to the CSS framework was some of the colors so that I could pass the Lighthouse Accesibility tests
- Express Middleware
    - serve-favicon : Serves a favicon for browser tab icons
    - express.urlencoded : decodes URL encodings when the HTTP request is sent with a url encoded type
    - cookie-session : creates and manages a cookie session with users
    - express.static : Serves static content from a specified public directory
    - express.json : parses JSON data when the HTTP request is sent with a JSON endoced type 

## Technical Achievements
- **Tech Achievement 1**: I deployed my app on Heroku. I thought they were similar, I do think Heroku seems more like a professional hosting service that has much more features like load balencing and others.
- **Tech Achievment 2**: I got a 100% on all the lighthouse categories

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
    - Informative Titles: I made sure my titles detailes exactly what was on the page
    - Meaningful Link Text: My link text describes the page it takes you to
    - Clear instructions: I provided helpful messages for people using the site
    - Clear and concies content: I tried to write as little as possible on the page so users can focus on the page
    - Sufficent contrast: I made my primary color darker than the default color that came with my CSS framework so it would be easier to read
    - Dont use color alone to convey info: I made a little popup box that informed the user of errors
    - Ensure interactive elements are easy to identify: Links are a different color than other text and buttons are clearly seperate from text as well
    - Clear and consistent navigation: The navigation bar of the app is always visible
    - Form elements have clear labels: The form elements each have a clear label and placeholder values associated with them
    - Easily identifiable feedback: If there is a field left blank, a little popup box informs you of the error and red highlighting shows you where it is
    - Using for attribute: I used the for attribute for the labels
    - Reflect reading order in code order: All HTML is semanticaly ordered
