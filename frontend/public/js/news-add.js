function addNews() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if(title == "" || content == "") {
        writeMessage("404", "Der Titel oder die Neuigkeit ist leer.");
        return;
    }
    fetch("./add",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({title, content})
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "200": {
                    clearFields();
                    writeMessage("200", data["Message"]);
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

function clearInput() {
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
}

