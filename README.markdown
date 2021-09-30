Assignment 3 - HORG Logger
===
http://a3-owen-blaufuss.glitch.me

A service for keeping track of one's occlupanid (bread clip) specimen collection, sorted by date and type.

Baseline Requirements
---
- Server, created using Express
- Login page, which only alows homepage access on a successful login.
- Persistent mongodb storage of existing users, with authentication via hash comparison and cookies for security and simplicity.
- Homepage with a results table and form allowing viewing/editing of the persistent mongodb dataset associated with that user
- Middleware packages used:
    - express (to handle server management)
    - body-parser (to get json from requests)
    - serve-favicon (to supply a common favicon across all pages)
    - cookie-session (to authenticate users)
    - helmet (to improve http security)
- Usage of the Water CSS template used for simplicity, with some custom CSS for displaying the HORG table
- HTML input in the form of textarea, date, and dropdown lists


Acheivements
---
- All four pages score 100% in all categories on Lighthouse (5 points)

