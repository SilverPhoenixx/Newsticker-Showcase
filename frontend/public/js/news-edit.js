const urlParams = new URLSearchParams(window.location.search);
const mainTitle = urlParams.get("title");

function updateNews() {
    const newtitle = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if(newtitle === "" || content === "") {
        writeMessage("404", "Der Titel oder die Neuigkeit ist leer.");
        return;
    }
    fetch("/news/edit",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({"title": mainTitle, newtitle, content})
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "200": {
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

function deleteNews() {
    const title = document.getElementById("title").value;

    if(title === "") {
        writeMessage("404", "Der Titel oder die Neuigkeit ist leer.");
        return;
    }
    fetch("/news/delete",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({title})
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "200": {
                    window.location.href = "/news-management";
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

function loadNews() {
    if(mainTitle === "") return;

    fetch("/news/get/" + mainTitle,
        {
            headers: {'Content-Type': 'application/json'},
            method: "GET",
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            document.getElementById("title").value = data.title;
            document.getElementById("content").value = data.content;
        });

}

loadNews();

