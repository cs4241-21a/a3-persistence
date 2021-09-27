Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## G3P Expense Tracker

Yihong Xu
https://a3-gp2p.glitch.me

This project is a website built with tailwindCSS that allows user to create account and log in to track their spending
and income (CRUD), and a Node.js server using the express framework, connecting to a mongoDB server.

### Features:

- **User Accounts**:
	- The user can create an account consisting of an email address and a password.
	- They can not get email verifications for creating and resetting the password yet.
	- They can log in with their account and ask the browser to remember their login for a week.
	- User activities are seperated so data they entered is private to other users.
	- I choose this method because I personally don't like to link accounts and believe accounts should be seperated.
	  Browsers are all equipped with password autofill now, so it can also be more convenient.
- **Remember Me**: Allows the browser to automatically sign user in for 7 weeks, else user will have to manually log in
  frequently
- **Expense Tracking**: The user can submit a transaction to the server, they can specify its type (income or expense),
  the amount of the transaction, the date it happened, and a customized note to explain that transaction.
- **Expense History**: The website displays a list of user expenses (and income) by date, shows the total income and
  expenses for a day, and lists each transaction entered by the user.
- **Expense Editing**: The user can edit a transaction by clicking on a button. They can edit its type (income or
  expense), the amount of the transaction, the date it happened, and the customized note. The user can also delete a
  transaction from the server.
- **Express Middleware**: Used 8 express middlewares, 5 of them are imported, 3 of them are customized, located in
  different sections of the server flow where needed
	- body-parser is used to parse communication to request body for server use
	- cookie-session is for storing and managing user cookies, used for user authentication in my case
	- serve-favicon is to serve the same favicon for all the pages.
	- express.static is used to serve static files (after the user was confirmed to be authenticated), with automatic
	  extension fallbacks set up so urls don't need extensions like `.html`
	- unnamed1 is used to check DB connection before any corrupted data gets past to the client, to avoid unexpected
	  server and client behaviors
- **User Interface**:
	- Looks and feels clean and professional, with vibrant colors and playful interaction animations
	- Well-designed, tested by testers and improved based on feedback
	- Responsive, changes layout based on device type or window width (supports mobile phones, tablets and PCs)
	- Accessible, contains hidden components for screen readers
- **User Experience**:
	- Data is sorted based on date, data is grouped based on date.
	- Loading animation indicates the website is working to get/update their data.
	- An empty table indicator tells the user when they don't have any data for the current selection.
	- Buttons are interactive, shows alternative looks when mouse hovering, clicking and dragging, touchscreen dragging
	  and more, to help user understand current options.
	- A full screen popup allows user to add a transaction wherever they are on the screen, in case referencing old data
	  is needed.
	- The edit popup automatically fills old data so the user don't have to copy it over if they don't want to change
	  that field.
	- Delete button located in secondary menu and labeled with interactive red colors to avoid accidental deletions
- **CSS**:
	- Used tailwindCSS as the CSS framework of this project, adapted official UI elements and drastically edited them
	  for my needs, including creating a set of custom color scheme. Customizations to the framework can be found
	  in `tailwind.config.js`
	- Used postCSS, purgeCSS and autoprefixer to produce an optimized minimal CSS file to ship to clients, reducing load
	  time
- **Two Tier Loading**: Loads a basic website that shows content loading first, then loads in all the data and process
  it for display
- CRUD (Create, Read, Update, Delete) of data
- Unique key for each entry
- **Folder System (not implemented)**: Users will be able to add data to different folders and view them separately in
  the future.
- **View System (not implemented)**: Users will be able to view data in pages based on customizable timeframes in the
  future.
- **Currency System (not implemented)**: Users will be able to label transactions to be in different currencies and
  filter data with one or multiple currencies in the future.
- **Tag System (not implemented)**: Users will be able to use tags to label data and filter data with one or multiple
  tags in the future.
- **Summary System (not implemented)**: Users will be able to see weekly/monthly/yearly summary of their finical
  situation by tags in the future. This might include a generated statistic graph.
- **Theme System (not implemented)**: Users will be able to switch themes/color schemes and have them remembered by the
  server in the future.

### Technical Achievements (10/10)

- **Data Processing**: Sort and group data by date instead of displaying data in a table/list
- **HTML Templates**: Used JavaScript to automatically create HTML based on templates instead of adding data to a table
- Serve static files with automatic extension fallbacks
- Optimized `amount` datatype to save file size, internet usage and avoid float operation errors
- See above for **Beautiful User Interface**, **Great User Experience**, **Optimized CSS**, **Remember Me**, **Two Tier
  Loading**

### Design Achievements (10/10)

- Checks DB connection before connecting user, send error code to client to indicate error
- Reject unauthenticated users' access of private files, but allow for public file serving
- Serve static files with automatic extension fallbacks
- Display date with `Mon Sep 27 2021` format for convenience
- See above for **Beautiful User Interface**, **Great User Experience**, **Optimized CSS**, **Remember Me**, **Two Tier
  Loading**
