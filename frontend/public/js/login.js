function authenticate() {
    fetch("./login/authenticate",
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({
                "username": document.getElementById("username").value,
                "password": document.getElementById("password").value
            })
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            switch (data["State"]) {
                case "200": {
                    window.location.href = "./profil";
                    break;
                }
                case "208": {
                    window.location.href = "./newpassword";
                    break;
                }
                case "404": {
                    document.getElementById("error").removeAttribute("hidden");
                    document.getElementById("error").innerHTML = data["Message"];
                    break;
                }
            }
        });
}