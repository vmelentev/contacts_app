(async function init() {
    var names = [];
    var emails = [];

    const contacts = await retrieveData();
    populateArrays(contacts, names, emails);

    const Name = localStorage.getItem("Name");
    const email = localStorage.getItem("Email");

    const list = document.getElementById("list");

    if (Name != null && email != null) {
        names.push(Name);
        emails.push(email);

        await saveData(Name, email);

        localStorage.clear();
    }

    if (names.length > 0){
        document.getElementById("placeholderImage").remove();

        for (let i = 0; i < names.length; i++){
            let li = document.createElement("li");
            
            let img = document.createElement("img");
            img.className = "person";
            img.src = "src/person.png";

            let div = document.createElement("div");
            div.className = "details";

            let nameField = document.createElement("p");
            nameField.className = "Name";
            nameField.innerHTML = names[i];

            let emailField = document.createElement("p");
            emailField.className = "Email";
            emailField.innerHTML = emails[i];

            let contactBtn = document.createElement("button");
            contactBtn.className = "contact";
            contactBtn.innerHTML = "CONTACT";

            let removeBtn = document.createElement("img");
            removeBtn.className = "remove";
            removeBtn.src = "src/remove.png";

            div.appendChild(nameField);
            div.appendChild(emailField);
            div.appendChild(contactBtn);

            li.appendChild(img);
            li.appendChild(div);
            li.appendChild(removeBtn);

            list.appendChild(li);
        }
    }

    toggleScrollbar();
})();

async function saveData(Name, email) {
    try{
        const response = await fetch('http://localhost:3000/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, email })
        }); 
        const result = await response.json();
        console.log(result);
    } catch(error) {
        console.log("An error occured while trying to update the database", error);
    }
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

async function remove(email){
    try {
        const response = await fetch('http://localhost:3000/api/remove-contact', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }) // Send the email in the request body
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log("User deleted successfully:", result);
            return result;
        } else {
            console.log("Error deleting user:", result.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.log("An error occurred while trying to delete the contact:", error);
        return null;
    }
}

function populateArrays(contacts, names, emails) {
    const contactsArray = Object.values(contacts);
    contactsArray.forEach(contact => {
        names.push(contact.Name);
        emails.push(contact.email);
    });
    console.log(names, emails);
}

document.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('list');

    list.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('remove')) {
            const listItem = event.target.closest('li');
            if (listItem) {
                const email = listItem.querySelector('.Email').textContent;

                remove(email);
                listItem.remove();

                toggleScrollbar();

                if (list.children.length === 0) {
                    const imgElement = document.createElement('img');

                    imgElement.id = 'placeholderImage';
                    imgElement.src = 'src/person.png';

                    const title = document.querySelector('.list h1');
                    title.insertAdjacentElement('afterend', imgElement);
                }
            }
        }

        if (event.target && event.target.classList.contains('contact')) {
            const listItem = event.target.closest('li');  
            const emailElement = listItem.querySelector('.Email');  
            const email = emailElement.textContent;           
            localStorage.setItem("email", email);
            window.location.href = "message.html"; 
        }
    });
});

function toggleScrollbar() {
    const list = document.getElementById('list');

    if (list.children.length > 3) {
        list.style.height = '270px';
        list.style.overflowY = 'scroll';
    } else if (list.children.length === 3) {
        list.style.height = '270px'
        list.style.overflowY = 'hidden';
    } else if (list.children.length === 2) {
        list.style.height = '180px'
        list.style.overflowY = 'hidden';
    } if (list.children.length === 1) {
        list.style.height = '90px'
        list.style.overflowY = 'hidden';
    }
}