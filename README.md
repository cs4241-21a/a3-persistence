
Glitch url: https://a3-yanglyujimmy.glitch.me


## CS4241 Assignment 3
  Login page/Loginfail page:
  On these two pages, you can login in with your username and password. You can sign up an account by going to the sign up page.
  Anyway, I can provide one here:
    username: 123
    password: 123
    
  Regist page:
  On this page, you can sign up an account. The username and password information of this account will be stored in the database collection 1.


  Main page:
  On the main page, you will see an account table. On the table, it shows everyone's name, savings, and cost. The balance is automatically calculated by the server once you insert new data.
  Balance = Savings - Cost
  
  Attention!: each user will have his or her own data table. If you are new user, your data table should be empty! If you log in "123" that account, after you click load table, you will see 2 data which I inserted before.
  
  All these data are stored in the database collection 2.
  It is stored like this: 
                          username: ...(string) // This is the username!!!
                          name: ...(string)
                          savings: ... (int 32)
                          cost: ...(int 32)
                          balance: ...(int 32)
  The LOADDATA button is used to get data that already in the database and display it on the page. (I try to make a get request to get this done automatically, but I failed. So I do it in this way. Once you click the button
  , it will send a post request to the server and get all data from the database and then display them on the page.)
  
  (Please don't add data that has same name so that when you delete data, you won't delete all data that have same name.)


Achievements:

Design/Evaluation Achievements

Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative:

  1. Provide informative, unique page titles
  
  2. Use headings to convey meaning and structure: I have headings in each html page.
  
  3. Make link text meaningful: I have "sign in here" and "register here" link text.
  
  4. Provide clear instructions: in the input, I tell users what need to be typed here.
  
  5. Keep content clear and concise
  
  6. Provide sufficient contrast between foreground and background: I make some color contrast between those icons,
  forms and text, so users can see them clearly and won't get visual fatigue.
  
  7. Don’t use color alone to convey information
  
  8. Ensure that interactive elements are easy to identify
  
  9. Ensure that form elements include clearly associated labels
  
  10. Provide easily identifiable feedback: There is a login fail page which indicates that the login fails.
  
  11. Use headings and spacing to group related content
  
  12. Identify page language and language changes
  
  