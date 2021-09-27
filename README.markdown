Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

Due: September 23th, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Your Web Application Title Pizza Calculator

your glitch (or alternative server) https://a2-evalabbe.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

the goal of the application To help plan for how many pizzas you need at a party while also taking into acocunt GF options

challenges you faced in realizing the application Honestly, a lot. I'll list a couple technical as well as a personal. I couldn't for the life of me get it to log in, I couldn't. Also, as of typing this, I'm still having a hard time pushing data to the db and am debating taking it out because I have two hours left and I'm not sure what to do. I'm currently trying to control my manic and depressive episodes by trying to get a sleep schedule but in trying to get a normal one im losing time to sleep as even if i sleep late i have to try to go to bed at a normal time. Bro I am stuggling hard in trying to catch up on school work. Things r rough on the streets.

what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable) I did not. there is no login page.

what CSS framework you used and why I used 98 as a CSS framework. I chose this because when I personally think of pizza parties I think of ones I threw as a kid at the local bowling allies or local roller rinks. Looking back at it feels so retro that I thought the style of Windows 98 was fitting. I'm going for nostalgia with this site.

include any modifications to the CSS framework you made via custom CSS you authored Going off of nostalgia I based the rest of the design off of old html websites I, as well as many other just-starting coders, made with their limited html css knowledge.

the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for one (and one alone) middleware please add a little more detail about what it does. I used cookie-session, morgan, and body-parser. cookie-session: morgan: body-parser:

Technical Achievements


Design/Evaluation Achievements

Design Achievement 1:

W3C Accessability:

1.) Provide informative, unique page titles - The page title is clear in what the website does. It calculates how many pizzas you need. 2.) Use headings to convey meaning and structure - The pizza log header makes sure the user knows what is being shown in the table below. 3.) Keep content clear and concise - The instructions make sure a user knows how to enter data. It is concise in its explaination. 4.) Provide sufficient contrast between foreground and background - I made sure to choose the lightest color from the windows 98 color pallet for the background so everything on top of it would stand out. 5.) Don’t use color alone to convey information - For the word "forgetting" I didn't just add color I also made it bold to make it stand out. 6.) Ensure that form elements include clearly associated labels - The inputs have labels saying what goes in ech box 7.) Provide easily identifiable feedback - As soon as you submit, the table is populated 8.) Use headings and spacing to group related content - I achieved this in implementing CRAP as explained below. Please see paragraph on proximity 9.) Identify page language and language changes - on the html it indicated that the language is english 10.) Use mark-up to convey meaning and structure - Aria Roles are used on page 11.) Provide clear instructions - The instructions are directly next to the input fields 12.) Ensure that interactive elements are easy to identify - The mouse changes when hovering over interactive elements and when hovering over the submit button the button changes color

Design Achievement 2:

CRAP:

I organized and styled my website according to the CRAP principles from the Non-Designer's Design Book to make the website look better
and make it easier to read. These principles allow for a user to read over the website easier and conect different parts quicker.They also just make it nicer to look at. I used contrast to make my site exciting/bold as well as to move users' attention to certain places. For the title of both the website and the table I used a bright color from the windows 98 color pallet to draw attention to them and to add fun to the website. These colors contrast greatly from the other text as well as the background. The underline also achieves these goals. I also colored the bolded word in the first paragraph to make it very different from the rest of the text adding emphasis to the word. Lastly, I made it so when you click on a text entry box, it gets darker. This allows the user to know which box they are typing in as it stands out from the others. Repition can be seen in the font used for the paragraphs, a constant change in paragraph font when they are the same type of content would be jarring and hard to read. It can also be seen in the title format for the title of the website as well as the title of the table. Both use the same color, font, and have the same underlines. This will help the user see there that it is a different section of the page helping to group the sections together (data entry vs showing the data). This brings me to proximity. Proximity helps a user know what info goes with what and grouping things that are similar helps the users eye go from one thing to another. I've clearly seperated the introduction of the site from the data entry to make it clear that we are moving on from explaining the site. Then I group the instructions on how to enter data with the data entry boxes, this is to make sure the user clearly sees and can read the instructions when entering data. Then at the bottom the title of the table and the table are close together so the user knows what the table below is. Finally we get to alignment. While the book tries to get readers to think outside of just middle alignment, which can be boring and not as sleek as other alignments, I do choose to center align the page as a whole. I do this because the design asthetic I am going for is old school first website and center align was the main choice along with right aligned. I decided center looked better than right align and went with that. You'll notice, however, that when the screen is small to medium sized text is left aligned. This makes the paragraphs easier to read. Because the paragraph at the top is right aligned I made sure the entry box is flush with the test edge making it look sleeker and more in line with each other.