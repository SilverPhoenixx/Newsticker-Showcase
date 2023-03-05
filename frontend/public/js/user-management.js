const userContainer = document.getElementById("userContainer");

function initialize() {
    fetch("./user-management/user-list",
        {
            headers: {'Content-Type': 'application/json'},
            method: "GET"
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            let innerHTML = "";
            data.users.forEach(user => {
                innerHTML += addUserToHTML(user.username);
            });

            userContainer.innerHTML = innerHTML;
        });

}

function addUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const repeatpassword = document.getElementById("repeat-password").value;

    if(password == "" || username == "") {
        writeMessage("404", "Das Passwort oder E-Mail ist leer.");
        return;
    }
    if(password != repeatpassword) {
        writeMessage("404", "Die Passwörter ist nicht identisch.");
        return;
    }

    if(username.length <= 3)  {
        writeMessage("404", "Der Benutzername ist zu kurz.");
        return;
    }

    const regex = new RegExp(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,64})/g);


    if(!regex.test(password)) {
        writeMessage("404", "Das Passwort entspricht nicht den Anforderungen. (mind. 6 Zeichen, Groß- & Kleinbuchstaben und eine Zahl)");
        return;
    }
    fetch("./user-management/user/add",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({"username": username, "password": password})
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "200": {

                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";

                    writeMessage("200", data["Message"]);
                    userContainer.innerHTML += addUserToHTML(username);
                    break;
                }
                case "404": {
                    writeMessage("404", data["Message"]);
                    break;
                }
            }
        });
}

function removeUser(username) {
    fetch("./user-management/user/delete",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({"username": username})
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "200": {
                    writeMessage("200", data["Message"]);
                    document.getElementById("user" + username).remove();
                    break;
                }
                case "404": {
                    writeMessage("404", data["Message"]);
                    break;
                }
            }
        });
}

function writeMessage(state, message) {
    switch (state) {
        case "200": {
            document.getElementById("messageContainer").setAttribute("class", "rounded bg-success my-3 px-3");
            break;
        }
        case "404": {
            document.getElementById("messageContainer").setAttribute("class", "rounded bg-danger my-3 px-3");
            break;
        }
    }

    const element = document.getElementById("message");
    element.innerHTML = message;
    element.removeAttribute("hidden");
}

function addUserToHTML(user) {
    const innerHTML = "<tr id='user" + user +  "'>" +
        "<td class='align-middle'>" + user + "</td>" +
        "<td>" +
        "<button onClick='removeUser(&#39;" + user + "&#39;)' class='material-symbols-outlined rounded float-end btn btn-outline-danger'>" +
        "delete" +
        "</button>" +
        "</td>" +
        "</tr>";
    return innerHTML;
}

initialize();