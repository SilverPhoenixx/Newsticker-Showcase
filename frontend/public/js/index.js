const container = document.getElementById("container");

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

            data.news.forEach(news => {
                addTo(container, news.title, news.content);
            });
        });
}

function addTo(element, title, content) {
    element.innerHTML +=
        "<b>" + title + "</b> " + content +"&#160;</span>";
}

function addSpeed() {
    document.getElementById("marquee").setAttribute("scrollamount", "100px");
    setTimeout(function() {
        document.getElementById("marquee").removeAttribute("scrollamount");
    }, 500)
}

initialize();