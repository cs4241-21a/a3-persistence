## Shape Collection

https://a3-m-d-jo.glitch.me (please see creator.html for the creation page - I was having trouble with automatic redirection!)

THe goal of this application *was* to let users define colored cubes and name them - but after reworking too many things and poor prioritization on my part, I was not able to finish.

The most significant challenge I ran into, of course, was the breadth of this assignment.  It was very hard to focus on one component at a time, and I often found myself needing to make more validation checks/callbacks than I previously thought.  I definitely would have benefitted from planning out the entire thing beforehand and forcing myself to tackle it in smaller pieces.

For authentication, I decided to use cookies as demonstrated in class.  I didn't have enough time to get it working as intended.

I chose Bootstrap for this application as I had some experience with it already, and felt it would be simple enough to knock out the basic UI I wanted.

I didn't give myself time to experiment with any Express middleware.  I was planning to use serve-static, serve-favicon, cookie-session, body-parser, and passport for OAuth support.

Minimal styling is applied - just a few spacing adjustments to existing Bootstrap elements.

## Technical Achievements
- **Three.js**: This was not a tremendous achievement (and not the source of my delays, I promise), but I used a Three.js for the first time.  The modal menu used for making shapes includes a scene viewer with the shape spinning inside.  The shape's material color changes as soon as you make a selection from the color picker.