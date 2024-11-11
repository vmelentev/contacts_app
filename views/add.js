const form = document.getElementById("form");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const content = document.getElementById("field");

function goHome() {
    window.location.href = "contacts.html";
}

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    nameField.style.borderColor = "initial";
    emailField.style.borderColor = "initial";
    if (document.getElementById("errMsg")) {
        document.getElementById("errMsg").remove();
    }

    var valid = true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var errMsg = '';

    contacts = await retrieveData();

    if (nameField.value === null || nameField.value === '') {
        errMsg = "Error - name cannot be left blank";
        valid = false;
        nameField.style.borderColor = "red";
    } else if (emailField.value === null || emailField.value === ''){
        errMsg = "Error - email cannot be left blank";
        valid = false;
        emailField.style.borderColor = "red";
    } else if (!regex.test(emailField.value)) {
        errMsg = "Error - invalid email address";
        valid = false;
        emailField.style.borderColor = "red";
        console.log(regex.test(emailField.value));
    }

    const contactsArray = Object.values(contacts);
    contactsArray.forEach(contact => {
        if (emailField.value === contact.email){
            errMsg = "Error - a contact with this email address already exists";
            valid = false;
            emailField.style.borderColor = "red";
        }
    });

    if (valid === true){
        var name = nameField.value;
        var email = emailField.value;
        
        localStorage.setItem("Name", name);
        localStorage.setItem("Email", email);

        window.location.href = "contacts.html";
    }
    else{
        displayErrMsg(errMsg);
    }
});

function displayErrMsg(errMsg){
    let p = document.createElement('p');
    p.className = "errMsg";
    p.id = "errMsg";
    p.innerHTML = errMsg;
    field.appendChild(p);
}

async function retrieveData() {
    try{
        const response = await fetch('http://localhost:3000/api/retrieve-data', {
            method: 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log("retrieved contacts:", result);
        return result;
    } catch(error) {
        console.log("An error occured while trying to retrieve contacts from the database")
    }
}
