## Race Results Tracker V2

https://a3-andrew-whitney.glitch.me/

![Results](Results.png)

- The goal of this application was to create a website that would allow users to keep track of a race and the results of that race.  I intended it to be used as part of a larger application for a more effective use, maybe one where you could automatically submit new user entires as the racer finished instead of it being manually entered.
- I faced a lot of challenges with having the authentication work on the glitch server and making sure glitch server work properly with my application.

![Login Image](Login.PNG)
- OAuth with the Github Strategy was the authenication method I chose to implement in my application.  I chose this method because creating a database full of usernames and passwords did not seem as secure as using a method already used in the industry.
- I used tailwindcss since it was advertised as a scallable framework.  This appealed to me as I did not want to use a framework that would become more difficult to deal with the larger my application became.  I implemented my own font using the tailwind config and also purged unused css from their libraries to keep the file size smaller and maintian a higher lighthouse score.
- helmet package was used to secure my HTTP headers.
- passport package was used to authenticate using github.
- serve-favicon package was used to serve up the favicon for my app.
- cookie-session package was used to authetnicate and keep tracker of logged in users on for my application.
- serve-static package was used to serve the static files for my webpage.



## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy.  This was challenging when moving over to glitch because I had to create a new oauth program in github and change the redirect urls in order to get the application to work.
- **Tech Achievement 2**: I was able to score a 100% on the lighthouse scores.  This required me to adjust colors and add in more descriptive labels for links along with have a better contrast between the font and the background color.
