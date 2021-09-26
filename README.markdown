## The Lame Calculator

https://the-lame-calculator.herokuapp.com

- The goal of this application is to provide a simple proof-of-concept server-side calculator, with no other purpose. Do not investigate further. (You can embed secret messages in the computation the server performs, and some messages provoke special replies that are visible ONLY TO THAT USER. Non-secret responses are visible to EVERYONE. If you can't figure out a secret message, try converting "forta" and making the expression the server computes evaluate to that value. This shows only a test of the secret message function, other secret messages usually provide hints as to how to find more secrets.)
- The difficulties I had with this assignment were mostly just small but progress-halting errors with libraries. Issues with code that I wrote I was able to resolve on my own, but the troubles I had were when I had to know how to use a library in some specific way or that I had to do some specific thing to make it function how I would expect. As a result, these issues were both time-consuming and frustrating.
- I chose to implement my own simple login authentication, both because it seemed simplest and because it meets the minimal authentication needs of this website while imposing no other account requirements to access the calculator.
- I used the Water.css framework for two reasons. Firstly, it is simple to use. Secondly, the intent of the website is actually _not_ to look fancy; the website is meant to look somewhat minimal and functionality-oriented.
  - I made only minimal changes for spacing in some areas and a warning class to make text red. The accessibility css is discussed in greater detail later.
- The five Express middleware packages I used are:
  - cookie-session: to handle and use browser-based cookies.
  - body-parser: to parse JSON the client sends to the server for me.
  - serve-favicon: to allow the use of a favicon (a cute lil calculator icon, in this case). Favicon retrieved from icons8.com.
  - helmet: to automatically add some security with best-practice headers.
  - custom: I use a custom middleware function that redirects the user to the login page if they are not logged in and continues otherwise.

## Technical Achievements

- **Tech Achievement 1**: I deployed my project to Heroku.

- **Tech Achievement 2**: My website scores 100% on Lighthouse in all categories for both mobile and desktop.

- **Tech Achievement 3**: (prof suggested I include this) Messages can be embedded in the calculation performed, and are actually parsed (not just checked against a list of special numbers) to determine whether to send a secret message back and, with a random chance, perform some shenanigans on database entries :)

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative after implementing my full website functionality (some of them came naturally as I wrote my code, so I omit them here):
  - Provide sufficient contrast between foreground and background: I changed my warning class to display a darker red text to contrast wit the white background instead of the light red text it was previously.
  - Ensure that interactive elements are easy to identify: Much of this came pre-completed from my CSS template, but I additionally wrote in my script.js to focus the name edit box when the edit button is pressed and the output of the convert button is focused after it is pressed too.
  - Provide easily identifiable feedback: I alert the user when they try to send something with invalid form fields, but I had already done this before reading the tips. After reading the tips, I changed the alert messages to be more descriptive and suggest how to fix the issue, if applicable.
  - Use headings and spacing to group related content: I added more subheadings to better identify distinct blocks of content, and I manually added CSS spacing to separate sections more.
  - Provide unique, informative page titles: I rewrote my page titles to actually describe the page they're on and be unique from one another.
  - Provide clear instructions: In addition to the previously mentioned improved feedback messages, I tried to word my instructions to be more specific and more amenable to non-visual users (e.g. middle box -> second box). However, it was difficult to strike a balance between clarity and secrecy, given that my website includes secrets.
  - Associate a label with every form control: This one was more involved. Since the purpose of the form inputs are clear from context, visible labels become redundant and kind of ugly. So I created a visuallyhidden css class that hides those labels visually but still allows screen readers to find and read them as appropriate. Idea from https://www.w3.org/WAI/tutorials/forms/labels/. Additionally, I added visually hidden text content to buttons that only had icons.
  - Help users avoid and correct mistakes: In addition to what was previously mentioned with regards to feedback, I also use regex to inform the user with mouseover text if they aren't inputting a valid operator. It isn't much by itself but in conjunction with every other form of notification, it helps.
  - Not specific to a particular tip but related to creating captions and meaningful text alternatives: I also added a visually hidden caption to my table, and used table headers (NOT stylized tds) so that screen readers can more usefully read out the contents of my table.
