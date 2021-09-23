lofi pitter patters to study to
===
*author:* jyalu wu

*assignment:* assignment 2 - short stack: basic two-tier web application using html/css/js and node.js

*website:* https://a2-jwu2018.glitch.me/

description
---
this website allows you to listen to chill lofi rain sounds and lofi beats while you study or code or do art or grade this assignment. you can choose the level of rain you want to listen to, whether or not you want lofi music in the background, what environment you want to be in, and also what name you want to give your playlist. a table showing your track mix history is shown on the right.

achievements
---
### technical achievements
- **middleware**: this site uses the serve-favicon, and middlewares.
- **sounds**: working with sound files was really tough for me since i'd never done it before. i found a javascript library called howler.js that allows you to use sounds on your website and although it wasn't hard to use, there were so many options and methods, i got a little lost. i found it really difficult to play two sounds at once since howler.js creates a new object for each sound and the objects could be hard to manage. for example, when the user wants to switch to a new rain mix (pressed the "play" button), the old audio objects have to be deleted or else the old sounds and the new sounds would overlap.
- **derived field**: the volume of the rain sound is calculated based on the level and the presence of lofi music in the background. each level has a different default volume and if the user specifies that they would like some music to go with the rain, the volume of the rain is decreased. when the two sounds start playing together, the rain is really loud at first but then goes down to the specified volume once the lofi music begins.
- **table scrollbar**: to prevent the table from getting longer than the page height, a scrollbar was made.

### design achievements
- **user study**: i asked my roommate (last name cleaver-stigum) to check if all the combinations of sounds worked for her. she said that yes, all the combinations worked. however, the radio buttons were doing something funky in firefox which was a bit surprising. when an option was selected, the circle buttons disappeared. i fixed that with a little css.
- **emoji favicon**: the favicon for this site is a music note emoji.
- **nice backgrounds**: you can choose the background for the website using the "environment" button.
- **cool fonts**: two fonts were chosen from google fonts to improve the lofi aesthetic.
- **custom radio buttons**: instead of a boring default blue/orange selected radio button, these ones are pink!


resources
---
- cafe wallpaper: https://wallpapercave.com/w/wp8965856
- car wallpaper: https://wallpapercave.com/w/wp4918883
- default wallpaper: https://wallpapercave.com/w/wp4334662
- forest wallpaper: https://wallpapercave.com/w/wp4649496

- rain sounds: https://mixkit.co/free-sound-effects/rain/

- howler.js: https://howlerjs.com/

- lofi music:
Green Tea by Purrple Cat | https://purrplecat.com/
Music promoted on https://www.chosic.com/
Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
https://creativecommons.org/licenses/by-sa/3.0/
