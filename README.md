# Find My Tupps

A tupperware tracker that uses express, mongodb, and a lot of my blood sweat and tears.

## Summary and Goals

The tupperware tracker made me question my major at some points, because how could I decide on such a stupid concept three
weeks ago and have to commit to see it through. Regardless, the goal of the project was to have the user log in, and then from
there they are able to add a tupperware to their account, and view logged tupperwares based off of the button actions on screen.
That's it.

## Challenges of Application Dev

I had a mental breakdown all week so that's what I have on my plate right now. I talked to someone about it but damn here I am
not sure if everything will go the way I want it to. Having the DB connection was painful at times, since I didn't use the
host var correctly and kept throwing a port number for it, but we fixed it and then it was just the next process of reading and
writing to tackle.

## Authentication Strategy: Cookies

cookies, because it made the most sense in my brain and had the most examples I could understand at three am online but then i broke them

## CSS Framework: BlazeUI (https://www.blazeui.com/)

For the CSS framework, I used Blaze, which provided formating for the site. I made modifications to the body
text itself to the font Railway, because I liked it better, and changed the styling of the buttons and images to be center page via margin and width edits.

## Middleware Packages used:

body-parser (https://www.npmjs.com/package/body-parser) used to parse through the json body.

serve-favicon (https://www.npmjs.com/package/serve-favicon) used to host favorite bar icon, previously was a static file within the HTML headers but was move as is better form.
Because I was hosting on git, it would not let me add my favicon.io to public instead of assets which means I had to comment this one out
so Glitch wouldn't crash but it's done correctly so I'm going to count it in my book.

serve-static (https://www.npmjs.com/package/serve-static) to serve pages

cookies-session () is what i would've used to track user login if i had time

cookies-parser () is what i would've used to track user login if i had time

## Design/UX Acheivements

(5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings.

## Contrast

For contrast, I focused on having the header and submit be the most impactful elements on the login page, since this is what the user should focus on the most. The second feature that provided contrast for the login page was Blaze's CSS styling of the login container, which is one of the reasons I chose the UI in the first place. For the headers, the login header was in bold, and the disclaimer about accounts was in Blaze's 'quiet' setting, which would be lighter. This breaks up the text and helps the user realize that the line is a disclaimer in the first place. For the logged in page, the ‘add’ and ‘view’ buttons were the most visible after the welcome message, since that was the main user interactions on the page (conveniently, the only as well.) I also drew attention to these buttons on the page by having a longer than expected box width, to really add some pop to them. The forms for filling out and the tables header information was bolded, to visually separate out the titles from the information presented.

## Repetition

For repetition, I used the same font across the whole website, Raleway, because I find it jarring when they change between body text/title/headers. Across all pages this font is the same, and I use the same color scheme for the whole site to improve visual cohesiveness. Within the page I made sure that the visual at the top of the page stayed consistent, to help build a general brand to the website and make it feel like one flowing application. For the elements, I tried my best to make the breaks consistent between forms to help keep a pattern on the structure, which is best seen in the “the tupperware info” section of the add form. For each form, I made sure the header is the same for each question and font size was the same for each section, which helped the user feel like it was one whole form.

## Alignment

For alignment, I choose to have my website centered across all images and buttons/headers since I liked the look of this. This included keeping the login form centered so the whole page keeps one trail visually with your eye. I thought this visually looked cleaner than having an unproportional amount of whitespace on one side over another. For the logged in page, I kept the header and the image also centered to stay consistent across the page, but changed the form alignment to break it up visually. The add form was two columns, which helped visually create a “block” feel for your eye, and following it had the button back to center so the user feels like the form has finished visually. I went back and forth on the justification of the columns and settled on left justified because it was standard in the Blaze UI, and I assumed they knew more about good design than I do.

## Proximity

For the proximity portion, it was important to me to have all the components close to each other visually so the user’s eye wasn’t being overwhelmed and pulled in all different directions. For the index page, this means having less whitespace between div’s, so everything is tucked in close together starting with the header image and ending with the login all on the page so you don’t have to scroll. For the logged in add form, having two columns side by side helps tell the user that this is one whole form and you should fill out the whole thing, but there are two different components to the form that logically should be separated to make filling it out easier. By having these block visablities set, I was able to ensure that my page dynamically resized the page and did not have empty room when it was ‘hidden’ or not. This prevents large whitespaces and having to have the user scroll for the feature they want to see or use.
