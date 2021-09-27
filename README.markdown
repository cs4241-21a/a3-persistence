# My Digital Library

https://alex-kinley-a3-persistence-csgmg.ondigitalocean.app

My Digital Library is a simple way to keep track of the books you own. 
You enter the ISBN, location, and your rating of a book, and then it gets added to your list of books. (for testing purpoes abe books lists isbns of books ex: https://www.abebooks.com/book-search/author/ROALD-DAHL)
The app makes use of (openlibrary.org)[https://openlibrary.org/dev/docs/api/books] books API to get information about a book from its ISBN. 

Authenticaion is done using Github OATUH2. Using passportjs with passport-github2 and following their example application this was fairly straightforward.

The app uses bootstrap 5 as the css framework. In some cases I wrote my own css styling for layout, particuarly for the login screen, and the header of the application. I suspect bootstrap could have done these, but it was going to be more effort to figure out how to do it with bootstrap alone. 

The Express middlware used is:
- bodyparser - for parsing the data passed along with requests
- session - used by passportjs for managing session cookies
- passport.initialize - the basic form of passportjs for authentication
- passport.session - makes passportjs use sessions for persistant connections
- ensureAuthentication (custom function only used for some endpoints) - for endpoint that require login, this checks if the user is authentication, and if they are not, they are redirected to the login page, this just ensures that for pages and api calls that require the user to be logged in, that they are in fact authenticated.

The main challenges I faced with this project were learning how to correctly use bootstrap, especially dealing with the modals was a non-trival endeavor. Additionally using external APIs is always a little bit of a challenge.

**NOTE:** While the openlibrary database seems to be reasonably alright, it is far from perfect. For example the API does not know the author of Harry Potter and the Sorcerer's Stone (ISBN: 059035342X). The backend will fill in mising data with various forms of "Unknown". 


Another tiny feature is that you can click on the header in the table to have it sort by that category. I would have liked to have some time to give this more polish, including having icons indicating how it is sorted and have it flip between ascending and descending, but I had to prioritize other features ahead of this.1

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

This ended up being fairly straightforward, as the passport-github2 package has a simple example with everything I needed.

- **Tech Achievement 2**: Hosted on Digital Ocean. 

With the DigitalOcean "Apps" this ended up being very straightforward. I just linked it to the github repo, and it figured most of the rest of it out. The one additional thing was having to set the environment variables within the digital ocean gui, but once I found the option it was straightforward.

- **Tech Achievement 3**: 100% on all four lighthouse tests. 

When I tested in the Brave browser (chromium based), the website obtained 100% on all four categories.
