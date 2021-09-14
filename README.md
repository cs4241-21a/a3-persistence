# WPI Computer Science SA, TA, and GLA Tracking Sheet
This project allow the user the ability to enter information for WPI Computer Science Department Senior Assistants, Teaching Assistants, and Graduate Learning Assistants. This all contained in a single web page which automatically updates after every action. 

In order to position my elements, I used the CSS grid format. This allowed me to have whitespace on either side of my main content section while also organizing my Input Area and Tutorial Area. 

In order to use my application, please read the Tutorial Area (labeled "How To Use"). This is also shown below. 

All testing was completed in Chrome and Firefox. 

How To Use:
- Enter the necessary information in the Input Area.
- When you've entered new information, click Add Entry.
- To remove a item, click the Remove Entry button in the respective row.
- To update a item, input the necessary information you wish the result to contain in the Input Area and add click the respective row's update entry.

## Technical Achievements
- **Tech Achievement 1** (10 points): Using a combination of GET and POST requests, I created a single-page app that both provides a form for users to submit data and always shows the current state of the server-side data. Every button the user can click leads to a POST request being send to the server. This POST request will return the list of all data entries currently in the server's memory. This also persists through the frontend restarting whether through a page refresh, opening a new page, etc. Every time the page is reset, a GET request gets the updated list of information from the server. This ensures that the client is never out of data and the table won't act buggy when adding that first entry after a refresh.
- **Tech Achievement 2** (5 points): Update and remove table entry functionality are working as intended.

### Design/Evaluation Achievements
- **Design Achievement 1** (5 points): User study 1 was completed and is listed below.

    1. Provide the last name of each student you conduct the evaluation with.

        Stephano Jordhani

    2. What problems did the user have with your design?

        We discovered an issue where my update and delete actions did not work in Firefox, they only functioned in Chrome. He did not dislike anything involving the layout itself.

    3. What comments did they make that surprised you?

        I was surprised 2/3 of the actions did not work in Firefox, I didn't expect there to be such a difference between browsers. There were no surprising comments about comments on the layout itself.

    4. What would you change about the interface based on their feedback?

        I would not make any changes to the interface itself based on this feedback, I did change the front-end to be Firefox compatible, however. 
        
- **Design Achievement 1** (5 points): User study 2 was completed and is listed below.

    1. Provide the last name of each student you conduct the evaluation with.

        Yihong Xu

    2. What problems did the user have with your design?

        The issue he encountered was having difficulty with the update field, it isn't as straight forward as it should be as you enter the new entries and update entries in the same area. 

    3. What comments did they make that surprised you?

        I was not surprised by any comments, they all were fairly expected.

    4. What would you change about the interface based on their feedback?

        I would probably spend some extra time to change how update works, whether it uses separate input fields or whether it is a two step process as it is a little confusing. 

