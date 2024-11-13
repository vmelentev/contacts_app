function goHome() {
    window.location.href = "contacts.html";
}

const email = localStorage.getItem("email");
const emailField = document.getElementById("email");

emailField.value = "TO: " + email;
