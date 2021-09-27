## Ice Cream Order Logger
https://a3-npelletier2.glitch.me/

Note: There is a test user with some information already associated with it:

Username: test

Password: 123

### Goals
Allow a user to document information about ice cream orders

### Challenges
- I had to try a few different methods for centering the window div. Initially I had a solution using the CSS transform() function, but I discovered that caused part of the top of the window to get cut off on smaller screens, i.e. the top of the window was not visible, and I could not scroll up to it.
- The font style provided by 98.css was too small according to Lighthouse, so I had to fix that by applying "font-size: 110%" to every element in the website. This fixed the issue of fonts being too small, while also retaining the proportions between header text and body text.
- I originally had the order information for a user displayed in a div, and I wanted that div to be clickable so that a user could click it to be directed to a page to edit that order. I eventually discovered that just changing the div to a button would work, and that making it a big button actually made it more clear that the order was clickable through the styling from 98.css.
- Getting used to how middleware works was challenging for me, sice I had basically no experience with creating web servers before this class. So, finding middleware to use in my project was also a challenge.
- I noticed that, when dealing with the database, mismatching/incorrect types was a common source of error. In particular, there were a few instances where I wasn't sure whether an order number was actually going to be a string or not. Also, when geting document IDs from the database, I had to convert them to a string, then convert them back into ObjectId to access the document through its ID again. Examples of this can be found in the "/add-order" and "/submit-edit" post request routes.
- I had to fiddle with the z-index of the checkboxes, radio buttons, and labels, since leaving them as is would make the labels cover up the checkboxes in a weird way where they would only be clickable in a specific 1px wide column.

### Authentication strategy
The authentication strategy I used is very simple: try to find the user in the database by the given username, then, if it is found, check if the given password matches. I kind of had plans to change this to be more secure, but the rest of the project ended up being a lot of work, so this easy implementation is what stayed. This strategy definitely should not be used in any serious web app, but it is being used here because it is easy.

### CSS framework
The CSS framework I used is 98.css. The point of this framework is to allow the creation of user interfaces that mimic the look of Windows 98. The reason for using this framework is simply because I thought the idea of making an interface that looks like that was interesting. I figured that, since the purpose of my application isn't an incredibly serious one, I could choose a framework that wasn't made to be super professional. The aesthetic of Windows 98 isn't incredibly professional nowadays, but it's an aesthetic that I find appealing, and I thought it would convey the fact that this appplication was meant to be more fun than serious.

### Middleware packages
`serve-favicon`
- Makes it easy and (typically) more efficient to serve a favicon, which is requested by browsers very frequently.

`cookie-session`
- Creates a `session` property in requests sent to the server containing the cookies for that session.

`serve-static`
- Serves files from a static directory.
