// Functions to access important API endpoints
export default {
    // returns all boards (based on the user)
    async getAllBoards() {
        let res = await fetch('/boards', {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        return v
    },

    // Get all the comments and replace the user id with their name (inefficient -> could expose another endpoint that takes in a list of ids and returns all users at once)
    // or just store username 4head
    async getCommentsForBoard(boardID) {
        let res = await fetch(`/boards/${boardID}/comments`, {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        for(let c of v) {
            let u = await fetch(`/users/${c.author}`, {credentials: 'include', headers: {'Content-Type': 'application/json'}})
            let user = await u.json()
            c.author = user.name
        }
        return v
    },

    // Create a new board
    async createBoard(board) {
        let res = await fetch(`/boards`, {credentials: 'include', method: 'POST', body: JSON.stringify(board), headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        return v
    },

    // Create a new comment
    async createComment(comment) {
        let res = await fetch(`/comments`, {credentials: 'include', method: 'POST', body: JSON.stringify(comment), headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        return v
    },

    // Update the board content
    async updateBoardContent(boardID, content) {
        let res = await fetch(`/boards/${boardID}`, {credentials: 'include', method: 'PATCH', body: JSON.stringify({content: content}), headers: {'Content-Type': 'application/json'}})
        let v = await res.text()
        return res.status == 200
    },

    // Get a single comment and replace the id with name
    async getComment(commentID) {
        let res = await fetch(`/comments/${commentID}`, {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        let u = await fetch(`/users/${v.author}`, {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let user = await u.json()
        v.author = user.name
        return v
    },

    // Get list of users
    async getUsers() {
        let res = await fetch('/users', {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        return v
    },

    // Delete a board
    async deleteBoard(boardID) {
        let res = await fetch(`/boards/${boardID}`, {credentials: 'include', method: 'DELETE', headers: {'Content-Type': 'application/json'}})
        return res.status
    },

    async deleteComment(commentID) {
        let res = await fetch(`/comments/${commentID}`, {credentials: 'include', method: 'DELETE', headers: {'Content-Type': 'application/json'}})
        return res.status
    }

};