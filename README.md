Bucket List Simulator
http://a3-palomagonzalez.glitch.me

The goal of Bucket List Simulator is to allow users to create a digital version of their bucket list, to which they can add different items they would like to complete, a date they would like to have completed them by, and the level of priority the bucket list item has for them. 

Some of the challenges I encountered in developing the application were setting up user authentication and displaying user specific data, as well as allowing for user editing of data.

I chose to authenticate users by comparing them to my MongoDB users collection because it was the most straightforward way for me to understand it.

I chose to use Cirrus as my CSS framework because it gave me a really clean, simple, and high contrast look that I was looking for in my application. Additionally, Cirrus was very simple to install and apply to my pages. I did modify some text sizes in order to create more contrast, as well as the margins around the edit and delete buttons.

The six pieces of Express middleware I used were:
- bodyParser: used for converting between strings and JSON objects, and vice versa
- cookie-parser: creates cookie sessions
- morgan: logs HTTP requests
- compression: compresses HTTP responses
- response-time: logs HTTP response time
- helmet: helps secure the app by setting various HTTP headers

The usernames and passwords available to log into the site are:
- paloma/testpass
- testuser/testpass

Design Achievements:

I used the following 12 W3C tips for making my website more accessible:
- Don’t use color alone to convey information: in my priority field, the bucket list gets a different background color depending on the priority level. However, I also listed out the priority level in text so that it is not only being conveyed by color.
- Ensure that form elements include clearly associated labels: all of the forms on my site have associated labels above the fields, as well as besides the field on the radio input selector
- Use headings and spacing to group related content: I used headings on all of my pages and kept related contents closer together. For example, my form to submit bucket list items is all grouped together so that it is clear they are all part of the form
- Associate a label with every form control: every form on my site has labels associated with each input
- Identify page language and language changes: all of my pages have an html lang attribute that specifies that the page language is English
- Reflect the reading order in the code order: my code is all organized in the same order that the user will be reading. I double checked this by removing CSS styling and making sure that the site was still readable with no styling rules
- Provide informative, unique page titles: all of my pages have titles that are short and descriptive of the use of the page
- Use headings to convey meaning and structure: I have used headings in my pages in order to attract the users attention to important information as well as to give a clear structure to my pages
- Provide clear instructions: in my login page, I provided instructions to the users indicating that if this is their first time logging into the site, a new account would be created for them
- Keep content clear and concise: all of the language on my pages is short, clear and concise. I did not clutter the pages with any extra text that was not necessary and I made sure to keep sentences clear and as short as possible.
- Provide sufficient contrast between foreground and background: The background of my website is white while the text on the page is really dark gray, creating sufficient contrast between the text and the background
- Create designs for different viewport sizes: my website will dynamically resize depending on viewport sizes so that all of the elements are clear and fit well on devices with different viewport sizes

The following are the ways I followed the CRAP principles:
- Contrast: as previously mentioned, the main source of contrast on my website comes from the colors. The background of the site is pure white, while all of the text ranges in different shades of gray. The main text is a very dark gray shade, very close to black, which provides very stark contrast with the clean white background. Additionally, there is some more contrast created on the site when you add items to the bucket list, as, depending on the priority, they get highlighted in a different color, all of which contrast well with both the background and the text on top of it. I chose to use a red, yellow, green color palette for the priority levels as I thought they provided good contrast with each other but also went well together as they are a common combination in the real world in items such as stoplights. 
- Repetition: there are a few elements of repetition in the pages for this project. The first one that comes to mind is the usage of the same font in all of the text on the website. Using the same font in different weights ties the site together and creates contrast between the different text areas, however, it also keeps the website consistent and gives it a signature look. Additionally, all of the buttons on the site have the same styling, which cements the cohesive look of the site, plus gives visual cues to the users that what they are encountering is indeed a button. This makes the site more accessible as well as easier to use. The colors are also repeated throughout the site, adding to the really consistent look of the site.
- Alignment: alignment is a very important design property as it helps create visual hierarchy, increases readability and aids with creating contrast between elements of the site. In my site, I chose to use a left alignment because it is, in my opinion, the most readable and strongest of the different alignment options. Form labels are placed above their associated input areas with a left alignment in order to make the form more readable and create contrast between the label and the input area. The only exception to the left alignment rule is the buttons on my page. The text on the buttons is center aligned with the button, which is a conventional alignment for buttons and avoids the problem of having too much white space on either side of the button container.
- Proximity: the main example of proximity on both of my main pages on this web project are the forms. All of the form input fields have associated input labels that go along with them and describe what the user must input in the field, and these labels are always situated above or beside the input field in close proximity in order to demonstrate a relationship between the label and the input field. Additionally, the form input fields and their labels are also in close proximity to the other input/label combinations in the form, which allows for the user to associate all of the inputs in a single form together. Another example of proximity on my site involved the edit and delete buttons that are associated with each data entry. These buttons are appended right next to the data entry, which allows for the user to understand that the buttons correspond to that specific data entry.
