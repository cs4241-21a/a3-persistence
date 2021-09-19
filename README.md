Assignment 3 - Its Gettin Real
===

## [Database System](https://a3-taylor-cox.glitch.me)
Database system to allow users to log information about people, including their
first name, last name, birthday and their gender. Users can add, modify and
delete database entries by clicking the buttons at the top of the page. Users
are authenticated using passport.js, through github using the passport module
passport-github. Bootstrap is used for all styling of the page. Persistant data
storage is through MongoDB. All data for the authenticated user is viewable
after logging in. Javascript is used to connect to the server and send requests
for adding new users, modifying users, and deleting users mainly, as well as
updating the page when querying the database. All LightHouse tests recieve at
least 90%.

## Technical Achievements
- **OAuth Authentication through Github/Passport.js**: Users are validated
  through passport.js and using their GitHub accounts.

- **100% in Lighthouse Tests**: Performance, Best Practices, Accessability and
  SEO all recieve a 100% when the LightHouse test suite is run.
