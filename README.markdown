## Ido Katz Shopping List

Link: https://a3-ido-katz.herokuapp.com/

### Summary 
- The goal of this application is to serve as an easy-to-use shopping list. The app also recommends a deadline for the user so that
  when they log in they can check the date and see if they have to buy anything. 
- One challenge that I faced was adding an ability to update records. I wasn't sure how I could refer to the same record multiple times between the client and server. I was 
  able to overcome that challenge by utilizing the object ID. 
- If the username in the database exists, then the server checks that the password associated with that username is correct. This seemed like the simplest method. 
- I used Water.css because it was responsive and simple to implement. I did not need a lot of "flash" so I decided to trust professional designers and use their stylesheets. 
  - No modifications
  
### 5 Middleware
1. app.use(express.static('public')); - Loads static pages
2. cookie-session - Allow the users information to be saved everywhere on the website. Use this to only show a user THEIR data
3. body-parser - Express parses the body and then converts it to JSON
4. favicon - Loads the favicon icon on each webpage
5. connect-timeout - Sets a hard timeout for the website. If the app is waiting a long time then it times out so the user doesn't wait forever. 


## Technical Achievements
- **Tech Achievement 1**: Host on Heroku

This was more involved than I expected it was going to be. I assumed I could just connect my github repo and everything would
  work because it was working fine on my local computer. Sadly that was not the case. The first thing I found out was that it didn't
  like that my name was 'Ido Katz' in the .json files; I had to remove the space. The other thing I learned is that I can't decide what port to listen on.
  This works locally but heroku wants to pick their own port. Lastly, in my package.json, I had to remove the version number which I
  originally had as '2.0' and change it to '2.0.0'. For some reason this caused a problem. Heroku is a bit more nit-picky than glitch, but the server will stay up and
  doesn't sleep/wake up at all

- **Tech Achievement 2**: 100% in all 4 lighthouse tests
![img.png](img.png)
  


### Design/Evaluation Achievements
- **Design Achievement 1**: CRAP principles write up
- Contrast: There is also a lack of contrast on the page in my input tags and the placeholder text (score: 2.53). This is beneificial
  because it hints to the user that the placeholder text is temporary and that it is a prompt for what they should 
  put in the text box. Another way I use contrast is through color. The shopping list entries are the only elements with color
  on the entire page. When a user logs in to check their shopping list, their eyes are instantly drawn to that color. I also made the orange and yellow
  colors a bit lighter instead of using the defaults. This made increased to contrast by a fraction of a point. 


- Repetition: There is general repetition between the login and main page. The forms you see are similar and placed one on top of the other in both pages. 
  I start every page with an 'h1'. Originally, the login page had an 'h1' at the top like it does now but the main page had an 'h2' at the top. As I was 
  exploring this principle, I realised that it made sense to be consistent and when I switched the tag, the pages seemed to flow better.


- Alignment: Most of my alignment can be attributed to the CSS framework that I used. It re-aligned my page and made it look more professional which was the entire point.
The most noticeable change was that instead of spanning the entire width of the screen, the elements are more tightly bound towards the center of the screen (although they are
  still right aligned). This is great for people with wide monitors; they wont have to move their eyes across the entire screen to read the instructions or the table itself. 
  You can also see that the margin between the form elements are smaller than the margin between other elements of the page. This signifies to the user that all those elements are united as one component. 
  


- Proximity: You can see that the margin between the form elements are smaller than the margin between other elements of the page. This signifies to the user that all those elements are united as one component.
As I mentioned above, the CSS framework I used squeezed the contents of my page more to the center. Bringing everything closer creates a more polished feel on a large monitor. In assignment A2, I had three 'br' tags between my
  form and the shopping list table. After exploring this principle, I reduced this number and I'm happy with how it looks now. The three breaks removed the table from the rest of the page. Now, with only one break, I 
  have the separation that I want, but the table does not look out of place. 

