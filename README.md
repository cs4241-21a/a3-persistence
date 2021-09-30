## M&M Tracker

your glitch (or alternative server) link e.g. http://a3-kylewynnm.glitch.me

For my project of A3, I built one of the most useful concepts I could imagine. 
For this project I created an M&M Tracker for personal consumption.
What this means is that I created a logger for one's consumption of M&Ms, per color.
A user can log in and make an entry of how many M&Ms they just consumed, for example
if I had an M&M eating session, I could log into my page and enter that I had 16
brown M&Ms, 22 green ones, etc.

Thanks to the persistent storage of the website using mongoDB, my entries are held until I delete them.
This means I can track my longterm consumption of M&Ms and see if I have some preference of color for M&Ms
that I did not know of.

I can also delete or update an entry if I made a mistake.

There are many challenges I faced in realizing this application.
- handling sessions was a task to say the least. I had trouble retaining the information regarding a user's session
only to learn that the trouble came from using Glitch's local view page. This means I would try to say a user was logged in
for a session, only for that information to be dropped. When I opened another tab for this it worked. This means I spent hours
debugging a non-existent bug.
- setting up the mongoDB certainly was a challenge of getting acquainted.
- getting entries to be updated was also a challenge as I had to figure out how to access and update previous entries.

- I chose a simple login authentication strategy with a username and password stored in the mongoDB to search for existing users
I chose this as it was the simplest route
- I chose the bootstrap CSS framework, I chose this as I am currently working on another project and it has been decided
that we will be using bootstrap, so i decided it' a good time to get some practice
- the five Express middleware packages were express.json to format the data uploaded, express.static to serve the information of the website,
cookie-session to hold onto user information, helmet to help secure the app with HTTP headers, and serve-favicon to adjust the icon of the site.


### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
1. Provide clear instructions - I mentioned the requirements for the password entry upfront
2. Keep content clear and concise - I kept my instructions brief and clear for how to use the site
3. Make link text meaningful - All buttons are clear and concise and say exactly what they will do.
4. Provide informative, unique page titles - The page titles describe exactly what they're doing
5. Provide sufficient contrast between foreground and background - there is a high contrast on the website of text and background
6. Don’t use color alone to convey information - All information is converyed through text
7. Ensure that interactive elements are easy to identify - All buttons and information pops out of the website and is clearly described
8. Ensure that form elements include clearly associated labels - Every input has a line with clear description
9. Provide easily identifiable feedback - Mistakes prompt easily read alerts
10. Use headings and spacing to group related content - Headings describe the content of each page and say hi to the user
11. Create designs for different viewport sizes - Part of why I chose bootstrap
12. Associate a label with every form control - Every form field has a label
