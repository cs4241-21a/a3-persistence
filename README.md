a3-BennyRob - Ben Robinson - https://a3-bennyrob.glitch.me
---


**Goal**


The goal of this application was to create a simple place where people can store
text data of any kind. This was to be implemented with an express server and MongoDB database.
I started this project from the hello-express starter from glitch as it was recommended in the readME.

**Challenges**

I faced quite a bit of challenges when developing this application. A lot of my struggles came
from an extremely busy week, and I wasn't able to work through all of them. Overall, the biggest issue
I had was with modifying the data. I couldn't find a proper was to do it, so I cannot add, edit or delete
any data associated with users. However, I can still create new users and grab their associated data.

Baseline Requirements
---

**Express Server**

Have a working Express server

**Results Functionality**

Have a results functionality that works - Because adding data doesn't work on mine
use username 'brob' and password 'pass' and you can see it grabbing the data from the server aswell

**Form/Entry**

I wasn't able to get my form/entry to be functional on time.

**Persistant data/MongoDB**

Persistant data storage works, and my application succesfully adds and retrieves data from MongoDB

**Authentication**

For authentication I used cookies, simply because I didn't have time to do OAuth

**CSS Framework**

For my css framework I used Pure due to it being easy to use. I mainly used it to center my HTML objects
and make more structured in general.

**Express Middleware**

I used the 5 following express middleware: (Not sure if these are all implemented correctly, had a bit of struggle with these)

cookie-session - Used to handle cookies

session-timeout - Used to timeout requests if they are taking too long

morgan - Used to log requests

**Lighthouse**

I have above 90 for all 4 tests, with a 99 overall

### Design/Evaluation Achievements
- **Design Achievement 1**: Followed 9/12 tips. Couldn't get more in do the simplicity of my website. (Just hoping for some partial credit here)

Unique Page Titles - I only have one page title, but named it SafeStore Inc. , which 
is how they had it on W3C

Headings and subheadings - I have a very small website, but still utilized both a heading and a subheading like W3C

Keep content clear and concise - My entire website is very concise, I think I follow this tip well

Associate a label with every form control - I have one form (Thats working), but I do associate a label with every form control in that form

Help users avoid and correct mistakes - If users forget to input and username or password it will alert them

Reflect the reading order in the code order - All my reading order is in the same order as the code

Ensure that all interactive elements are keyboard accessible - All my elements are accessible via the tab key on the keyboard

Provide easily identifiable feedback - Similar to help users avoid and correct mistakes, I will correct users on their form input

Provide clear instructions - Instructions are very clear, just log in to view your data.

