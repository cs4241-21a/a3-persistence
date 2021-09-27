// Functions to access important API endpoints
export default {
    async getAllBoards() {
        let res = await fetch('/boards', {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        console.log(v)
        return v
    },

    async getCommentsForBoard(boardID) {
        let res = await fetch(`/boards/${boardID}/comments`, {credentials: 'include', headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        console.log(v)
        return v
    },

    async createBoard(board) {
        let res = await fetch(`/boards`, {credentials: 'include', method: 'POST', body: board, headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        console.log(v)
        return v
    },

    async createComment(comment) {
        let res = await fetch(`/comments`, {credentials: 'include', method: 'POST', body: comment, headers: {'Content-Type': 'application/json'}})
        let v = await res.json()
        console.log(v)
        return v
    }

};