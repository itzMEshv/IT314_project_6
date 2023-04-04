let showPasssword = true;

function togglePassword(){
const eyeIcon = document.getElementById("eyeIcon");
const password = document.getElementById("signUpPassword");

if(showPasssword){
    console.log("showPasswordtrue");
    password.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
    showPasssword = false;
}
else {
    console.log("showPasswordtrue");
    password.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
    showPasssword = true;
}
}
