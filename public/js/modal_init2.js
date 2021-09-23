// initializes modal box

// Get elements from index.html
const modal = document.getElementById("modal");
const modalBtn = document.getElementById("modalBtn");
const exitModalBtn = document.getElementById("exitModalBtn");

// Forget Password Modal related code
modalBtn.addEventListener("click", openModal);
exitModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);

function openModal(){
    modal.style.display = "block";
}

function closeModal(){
    modal.style.display = "none";
}

function outsideClick(e){
    if(e.target == modal) {
        modal.style.display = "none";
    }
}