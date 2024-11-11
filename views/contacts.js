(async function init() {
    console.log("this ran");
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

        await saveData();

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
})();

async function saveData() {
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
        console.log("An error occured while trying to update the database");
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

function populateArrays(contacts, names, emails) {
    const contactsArray = Object.values(contacts);
    contactsArray.forEach(contact => {
        names.push(contact.Name);
        emails.push(contact.email);
    });
    console.log(names, emails);
}
