const userContainer = document.getElementById("userContainer");

function initialize() {
    fetch("./news/list",
        {
            headers: {'Content-Type': 'application/json'},
            method: "GET"
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)
            let innerHTML = "";
            data.news.forEach(news => {
                console.log(news)
                innerHTML += addNewsToHTML(news.title);
            });

            userContainer.innerHTML = innerHTML;
        });

}

function addNews() {
    const title = document.getElementById("title").value;

    if(title == "") {
        writeMessage("404", "Der Titel ist leer.");
        return;
    }
    fetch("./news/add",
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
                    writeMessage("200", data["Message"]);
                    userContainer.innerHTML += addNewsToHTML(title);
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

function addNewsToHTML(title) {
    const innerHTML = "<tr id='news" + title +  "'>" +
        "<td>" + title + "</td>" +
        "<td>" +
        "<a href='./news/edit/?title=" + title +"' class='material-symbols-outlined text-decoration-none float-end'>edit</a>" +
        "</td>" +
        "</tr>";
    return innerHTML;
}

initialize();