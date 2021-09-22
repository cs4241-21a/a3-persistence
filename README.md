## IDEA:

Board shares where you can invite others to review your writing/brainstorm (only you are allowed to edit)

Object Models:
- Board
    - Owner: User
    - Content: string
    - Reviewers: [uuid]
    - Comments: Comment

- User
    - Id: uuid
    - Name: string
    - Email: string

- Comment
    - Id: uuid
    - Author: User
    - Content: string
