Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  

Jared Poulos
## Your Web Application Title
The application is meant to store a list of chores to be done at my appartment. In order to add or modify a row, it must contain a name, chore name, and status (done, waiting to sunday, not done, etc.) A field for workload is derived from the number of tasks assigned to the person with that row's name in the table. In addition to modify or delete a row, there must be a valid ID in the text box near the modify button. Functionality exists to add, modify, and delete rows from this table. This app uses the CSS flexbox to allign its items, and fonts are Times New Roman and Papyrus.

## Technical Achievements
- **Modify and Delete**: Though these weren't originally technical achievements, my app is designed ot be able to modify or delete rows, using the row's id and a value of either -1 or not -1 passed in with the load attribute (which is recalculated anyway.) users can simply enter an ID of an existing row and change the contents, then click modify to save those changes, or click delete to delete the row entirely. (5pts) 
- **Single Page Always Up To Date**: When Add, Modify, or Delete are clicked, the server automatically sends the modified appdata in the response, which is read into the table on the app. This includes the derived field for workload (10pts)
### Design/Evaluation Achievements
- **Think-out-loud**: I met with Jack Sullivan to test my app. He figured out a now fixed ability to add rows with the modify button (input of -1 wasn't checked properly), which is now corrected. This surprised my somewhat because I had not anticipated that possibility. He also recomented I make the font color on the buttons white to be more readable, which I also did. I changed how the id input is checked and a bit of the css. 
