Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Summary
---

Glitch Link: https://a3-lockeanddemosthenes.glitch.me/

This application serves as a character list for a tabletop-style roleplaying game that can be edited and deleted by all users. Its purpose is extremely specific, but mostly boils down to monthly "battles" or other events requiring a signup sheet that can be difficult for 30+ users to edit at the same time. I genuinely see a use in it, I swear.

I struggled a lot in getting the site to read database and getting the actual functionality down. Most notably, I had a lot of issues implmenting the edit and delete tools that ended up boiling down to some really specific syntax. Part of the issues honestly came from me trying to code directly from Glitch, debugging for 3 hours, and then crying because I realized I'd typed "del" instead of "delete" in one spot. Yeah.

The authentication strategy I chose was based on local authorization. As a note to the grader, there are two guest users whose username and password are the same ("guest" and "asdf"), but you can also register a new account if you wish. It'll be stored :)

I based my CSS framework on sakura.css because of its minimalist, calming, and overall aesthetically appealing use. I modified it to fit a color theme that I liked more than the standard greyscale and changed a few font sizes, but it remains largely intact.

The five Express middleware packages I used are as follows:
- body-parser: parses the incoming request body
- morgan: shows an HTTP request log
- response-time: records HTTP response time
- connect-timeout: sets a timeout for HTTP request preocessing so it doesn't run indefinitely
- cookie-parser: populates the req.cookies field

As for performance, my site generally achieves 90+% across all four Lighthouse tests (according to Microsoft Edge, incognito Google Chrome, and Firefox), on both mobile and desktop. The one exception I found is on non-incognito Google Chrome (at least for me), which I believe is related to my extensions and tracking history.

Acheivements
---

*Technical*
- (10 points) Implement OAuth authentication: As noted above, I used local authentication to make dummy accounts (as well as allow registration) for access, and also added a logout function.
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment: As noted above, this may vary. However, I found that I got 100% on Edge and incognito Google Chrome.

*Design/UX*
- (10 points) W3C site accessibility:
	- Associate a label with every form control
	- Ensure that form elements include clearly associated labels
	- Identify page language
	- Provide sufficient contrast between foreground and background
	- Ensure that interactive elements are easy to identify
	- Use headings and spacing to group related content
	- Provide informative, unique page titles
	- Use headings to convey meaning and structure
	- Provide clear instructions
	- Keep content clear and concise
	- Provide easily identifiable feedback
	- Reflect the reading order in the code order