// initializes modal boxes for index.html

// Get elements from index.html
const pass_modal = document.getElementById("passModel");
const pass_link = document.getElementById("forget_password");
const pass_close_icon = document.getElementById("exitPass");

const signup_modal = document.getElementById("signup_modal");
const signup_prompt = document.getElementById("signup_prompt");
const signup_close_icon = document.getElementById("exitSignup");

// Forget Password Modal related code
pass_link.addEventListener("click", openModal);
pass_close_icon.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);

function openModal(){
    pass_modal.style.display = "block";
}

function closeModal(){
    pass_modal.style.display = "none";
}

function outsideClick(e){
    if(e.target == pass_modal) {
        pass_modal.style.display = "none";
    }
}

// related to signup modal
signup_prompt.addEventListener("click", openModal2);
signup_close_icon.addEventListener("click", closeModal2);
window.addEventListener("click", outsideClick2);

function openModal2(){
    signup_modal.style.display = "block";
}

function closeModal2(){
    signup_modal.style.display = "none";
}

function outsideClick2(e){
    if(e.target == signup_modal) {
        signup_modal.style.display = "none";
    }
}
