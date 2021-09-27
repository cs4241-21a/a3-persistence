Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## GenshinDB

https://genshin-db.herokuapp.com/

Genshin Impact is an open world exploration and gacha video game which can be played on mobile, pc, or Playstation consoles. This database is used to track
some of the characters you may own. 

There are seven elements in Genshin Impact (Shown below in the image):
- Hydro
- Anemo
- Pyro
- Cryo
- Electro
- Geo
- Dendro

![image](https://staticg.sportskeeda.com/editor/2021/06/67258-16247348366456-800.jpg)

The main challenge I faced was getting the OAuth authentication with GitHub strategy for the log-in and also getting familiar with bootstrap.

I used GitHub Strategy because I originally wanted to try to host the website on GitHub pages for fun and ended up implementing GitHub as the authentication method.

Speaking of Bootstrap, that is the CSS framework I used because it is one of the most popular, if not, the most popular CSS frameworks. I found it simple to use for 
someone who was not familiar with it at all. Some custom CSS I added was just for positioning.

The five Express middleware packages I used:
- **BodyParser**: BodyParser parses request bodies as well as validates information coming in.
- **cookie-parser**: Cookie parser interprets the cookie for the log in.
- **cookie-session**: Cookie session allows the user to use the cookie for their specific session on the website.
- **passport**: Passport is used for user authentication with nodejs. 
- **timeout**: Timeout sets a timeout period for HTTP request processing.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy.
- **Tech Achievement 2**: I hosted my site using Heroku.

### Design/Evaluation Achievements
- **Design Achievement 1**: Non-Designer's Design Book CRAP principles
  * Contrast: On the log in page, I decided to make a white box apparent with the log in form while the rest of the background is grey. 
  this would draw the viewer's attention towards the log in form. I also colored the Log in button a blue color so it stands out from 
  the rest of the page as well as darkened the GitHub sign on button to emphasize it. These very different colors follows the rule of if the objects are different, use different colors to distinguish between those objects.For the database page, I used the same vibrant 
  blue color for the add button, allowing for viewers to see and click the button. This will bring up a modal where the top text is 
  bold indicating the action so people know what the pop up is. The alter button is also blue to distinguish it from the rest of the 
  page. 
  * Repetition: I used Arial throughout the whole page to keep everything consistent. Changing fonts will make the viewers focus on the different fonts more than the content of the website. While I did only use one font throughout the entire website, this is fine since the website is not full of words. The spacing between most items is also 10px which keeps the spacing consistent. Throughout the whole website, I used the same blue color for most of the buttons and red for delete and log out. This allows viewers to see buttons are an important part of the website and they should be clicked. I also used the same dark background between the log in page and the database page for consistency. Lastly, each of the table headers are all bolded so people know they are the headers.
  * Alignment: On the log in page, I decided to center align all the elements, which is what is seen on most websites. This allows the log in page to look clean and organized. This is the main page people see when they visit the website and I did not want it to look like I threw all the elements on there without organization. I also made it clear the elements were centered. Once you log on to the database, you can see that I left aligned the character count and the Title. Normally, useful info is displayed on the top left, which is the reason I aligned it left. I also aligned the log out button to the right so it was out of the way of the content. 
  * Proximity: I used some margins on the log in page so that the buttons were not too clumped up with each other, while keeping the buttons in one area and the log in form above the buttons. This is generally how a log in page is layed out and will help viewers understand this is a log in page. Grouping related items together and separating items that are not relevant is very important to allow the website to be less confusing when it is looked at. I made sure to limit the amount of visual elements on the page and if there were many, I would group those together. An example is how the Alter buttons on the database are all at the last column on the right. The only exception was the Log out button, which is placed at the top right for emphasis on where to log out.
