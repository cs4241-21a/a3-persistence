# Assignment 3

I turned this in past the deadline but Professor Roberts said that it was okay :)

https://a3-jhsul.glitch.me

This website allows you to log your contacts persistently. You log into the application with your github account, and once you are logged in you have access to your contact book. You will be able to see some of your github info and a table of all your contacts. You can add new contacts, and edit/delete existing contacts. Contacst have a name, a phone number, and a country. I used the bootstrap css framework

## Middlewares

### `app.use(session({...}))`

This is a cookie manager for browser sessions. It's required by passportjs

### `app.use(express.json())`

Lets you access request bodies as json objects

### `app.use(passport.initialize())`

Starts the passportjs library

### `app.use(passport.session())`

Runs authenticated sessions. Requires the session middleware above

### `app.use(express.static(...))`

Serves static files from the public directory.

### Custom redirect

I wrote a custom middleware to redirect the user depending on whether they are logged in or not

## Technical Achievements

- Github OAuth
