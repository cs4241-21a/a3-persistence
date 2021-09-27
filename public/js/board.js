import client from "./client.js";

document.getElementById('submit-comment').onclick = async (e) => {
    let content = document.getElementById('comment-entry').innerText
    document.getElementById('comment-entry').innerText = ""
    
    let s = await client.createComment({board: window.location.pathname.split('/')[2], content})
    
    // add the comment to the list 
    let c = await client.getComment(s.insertedId)
    addCommentToDOM(document.getElementById('comments-col'), c)
}

let addCommentToDOM = function (commentList, comment) {
    // create the div element
    let bubble = document.createElement('div')
    bubble.classList.add('speech-bubble', 'shadow')
    
    let commentContainer = document.createElement('div')
    commentContainer.classList.add('comment-content')

    let p1 = document.createElement('p')
    let p2 = document.createElement('p')

    let author = document.createTextNode(comment.author + ':');
    let content = document.createTextNode(comment.content);

    bubble.appendChild(commentContainer)
    commentContainer.appendChild(p1)
    commentContainer.appendChild(p2)
    p1.appendChild(author)
    p2.appendChild(content)

    commentList.appendChild(bubble)
}

window.onload = async () => {
    let comments = await client.getCommentsForBoard(window.location.pathname.split('/')[2])
    let commentList = document.getElementById('comments-col')
    for(let c of comments) {
        addCommentToDOM(commentList, c)
    }
}