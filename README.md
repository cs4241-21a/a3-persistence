## Contacts in database

link: https://a3-orestropi-ai.glitch.me/

You can register or login with myUser, myPassword

Brief summary of project:

- The goal of the application is to have users store their own contacts in a mongo database(can delete,edit, and create)
- challenges I faced in realizing the application, were parsing JSON objects and client to server communication
- I chose cookies as an authentication strategy because it seemed the easiest to implement
- I use pure(https://purecss.io/start/) as a CSS framework since it did not mess up my dynamic table while also giving me a spacious feel. I made many modifications to make sure the dynamic table looked reasonably nice and implemeted some CSS based on CRAP principles.
- These are 6 middlware I used, added an extra one I used to be safe
1. app.use(express.json()); - Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
2. app.use( cookie({name: 'sessionLog',sameSite: "none",keys: [you will never know :)]})) - Cookie middleware, keys are used for encryption
3. app.use(express.static("public")); - middleware function in Express. It serves static files and is based on serve-static.
4. app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/views/index.html' )
}) - middleware that always sends unauthenicaetd users to the login page
5. app.use('/api/user', authRoute); - middlware that handles post and get request, so server is not as "chunky"
6. app.use( express.urlencoded({ extended:true }) ) - middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option

## Technical Achievements
- **Tech Achievement 1**: 
- (5 points) Got 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment. (pictures take on local host before deployment of app) 
![image](https://user-images.githubusercontent.com/73619173/134874534-203c7900-7ec9-4470-80f0-72d269a6f0c7.png)
![image](https://user-images.githubusercontent.com/73619173/134874648-3ff04bb6-1884-45d7-8b30-d03adf1a02f9.png)

- **Tech Achievement 2**:(IDK if trying to debug it and using logs for heroku count for anything, I also got the link for my site, and made comments on heroku)
-(5 points)I tried to use Heroku for many hours but could not understand their complicated and hard to use error logs :(. I got the site up but it has an H31 error in the error logs.https://a3-orest-ropi-ai.herokuapp.com/
![image](https://user-images.githubusercontent.com/73619173/134898956-270b79e3-f403-40f8-b4bd-360043e06c96.png)

What I liked about Heroku was that the authentication system was really secure and keeps my heroku account really safe. What I did not like as much as glitch was that the debugging was very diffucult and their was little information on the errors I was getting on my logs. Also, the logs required downloading a large app to access.


### Design/Evaluation Achievements
- **Design Achievement 1**: (5 points) How site use CRAP principles in the Non-Designer's Design Book readings

Which element received the most emphasis (contrast) on each page? 

The elements that received the most contrast were my buttons and title. They were what I wanted the user attention to be drawn to. Information about what they could do and how they can do it is the users main priority. I used dark blue for the title and black for the buttons because they contrasted the white background really well. In my log in page I also made the register and login buttons have a colored background. This is so the user can immediately locate them and use them. I had grey boxes in the login page to represent what sections were for login or registering, so the user could more easily differentiate between the two. Lastly I left the background white(on my login page and page with data) so the user would focus more on the application which they would be using, and not getting distracted by unnecessary images or colors.

How did you use proximity to organize the visual information on your page? 

I used proximity to organize the visual information on your page by grouping together items that were related to one another. On my login page I had the user login information all together inside a box. This allowed the user to find everything he needed about logging in quickly. I also had the registration information all together inside a box.  This allowed the user to find everything he needed about registering quickly. Putting these items in my logging page together also reduced clutter. In my page with the user data I grouped together all the information of a single contact together. In the user data page, I also grouped up the title with the table so the user knows exactly what they can put into the table, and what might not be allowed(such as duplicate contacts). 

What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 

I used the design elements of colors, fonts, and layout repeatedly throughout my site. I used colors to show similarities between logging in and registering. They both require a username and password to be inputted so I made their box, text, and background color the same. It also helps distinguish between the two options. This is since both have a similar color scheme and layout it is obvious that they are not interconnected. In my data page I repeatedly use blue color and large font to show important information. The user eventually gets used to the blue color and large font signifying important information that needs to be read. I also use bolded black on all my text in the labels of the tables. From this the user can concur that those are labels and not another data entry.

How did you use alignment to organize information and/or increase contrast for particular elements? 

I used alignment to organize information and/or increase contrast for particular elements. For example, in the login page the login button and the header for the login button are both slightly to the left of the center of the screen. This allows the user to organize them together(i.e. they would organize 'Log in here!' and the log in button). Another example, in the login page the register button and the header for the register button are both slightly to the left of the center of the screen. This allows the user to organize them together(i.e. they would organize 'Register in here!' and register the button). I also aligned the buttons and headers towards the center, so they would still be close to the boxes were the user is putting the data. In my user data page all the elements in my table cells are aligned in the center so they are easier to see. This also makes the cells more distinguishable from one another giving an increased contrast between them.


