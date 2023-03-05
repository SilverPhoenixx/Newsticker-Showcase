function changePassword() {


    const password = document.getElementById("newpassword").value;

    if(password == "") {
        writeMessage("404", "Das Passwort oder E-Mail ist leer.");
        return;
    }

    const regex = new RegExp(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,64})/g);
    if(!regex.test(password)) {
        writeMessage("404", "Das Passwort entspricht nicht den Anforderungen. (6 Zeichen, Groß- & Kleinbuchstaben)");
        return;
    }

    request(
        "./profil/change/password", JSON.stringify({
            "oldpassword": document.getElementById("oldpassword").value,
            "newpassword": document.getElementById("newpassword").value
        }));

    document.getElementById("oldpassword").value = "";
    document.getElementById("newpassword").value = "";
}

function changeUsername() {
    request("./profil/change/username", JSON.stringify({
        "newusername": document.getElementById("newusername").value,
        "password": document.getElementById("password").value
    }));

    document.getElementById("newusername").value = "";
    document.getElementById("password").value = "";
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

function request(url, body) {
    fetch(url,
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: body
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "404": {
                   writeMessage("404", data["Message"]);
                    break;
                }
                case "200": {
                    writeMessage("200", data["Message"]);
                    break;
                }
            }
        });
}