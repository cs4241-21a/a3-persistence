Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Tyler's Dice Roller

https://a3-trbouwens.glitch.me/

The goal of this site is to create a site where each user can store their own list of dice rolls for a tabletop RPG, or similar game which might use
RPG dice. It was hard to implement this per user, and to ensure that the rolls were not only fair, but also that modification to roll data was also fair. I was given
permission by the professor to only have the data of a roll be editable, and not just hard edit the roll value itself. I chose the simplest authentication strategy
where it just checks the username and password against the MongoDB.
As for my CSS framework, I used PicoCSS, as it was lightweight, simple, and had a good dark-mode login template ready to use.
And for middleware, I used the following:
- URL Encoding
- Serve Favicon
- Helmet
- Bodyparser
- Cookie-session

## Technical Achievements
- **Tech Achievement 1**: I got 100s in all four categories on both the login page as well as table page. There were some issues where the glitch site was losing me performance points due to latency, but I seem to have fixed those issues finally.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
  - Images having alt text for slower connections.
  - Clear login instructions
  - Sufficient Contrast (utilized the contrast class in PicoCSS)
  - Easily identifiable interactive elements. Links and buttons are very clear.
  - Form elements are labelled.
  - Easiliy identifiable feedback. It will tell you when something goes wrong.
  - Different viewport sizes. PicoCSS has good mobile views.
  - Using the for="" tag in form data for accessibility software utilization.
  - Using unique and useful page titles.
  - The order of elements on the HTML doc is the same as on the webpage.
  - Headed sections on the table page are well spaced and clearly defined.
  - I use the lang="en" in HTML to signify the language to accessibility software.

-**Design Achievement 2**: My site uses the CRAP principles in the following ways:
  - Contrast:
    - Buttons are specifically using the contrast class to be visible and noticeable compared to the rest of the page.
    - This also means that there are no extra colours, and the white of the buttons allows for more smooth contrast with the black background.
    - The login page aslo has contrast of elements, with the image providing colour and image contrast compared the all text rest of the page.
  - Repitition:
    - Each form on the table page is consistent in its styling, and repeats the same formatting as the previous one.
    - Styles for buttons, text, and links are also consistent.
  - Alignment:
    - The article functionality of PicoCSS really helped here, but each block of elements were able to be blocked together in a flex-grid kind of way
    - This means that evreything is nicely aligned and looks very neat when displayed side by side.
  - Proximity:
    - Everything is grouped together at the center of the screen. No information is ever very far apart of spaced out.
