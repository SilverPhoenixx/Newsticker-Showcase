const AbstractRoute = require('./AbstractRoute');

const DataManager = require('../../handler/DataHandler');
const dataManager = new DataManager();

const path = require('path');

class ProfilRoute extends AbstractRoute {

    initialize() {

        /**
         * GET
         * Show profil.html
         *
         * Redirect if not logged in
         */
        this.app.get('/profil', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.redirect("/login");
                return true;
            }
            res.sendFile(path.resolve(__dirname + "/../../../frontend/profil.html"));
        });

        /** POST
         * Update password with current username (session username) and password (body: { oldpassword: "", newpassword: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/profil/change/password', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."})
                return true;
            }

            if(!await dataManager.checkPassword(req.session.username, req.body.oldpassword)) {
                res.json({"State": "404", "Message": "Das Passwort ist inkorrekt."})
                return true;
            }

            let response;
            if(await dataManager.setPassword(req.session.username, req.body.newpassword)) {
                response = {"State": "200", "Message": "Das Passwort wurde erfolgreich geändert."};
            } else {
                response = {"State": "404", "Message": "Während des Änderns des Passwort ist ein Fehler unterlaufen."};
            }
            res.json(response)
        });

        /** POST
         * Update username with current username (session username) and password (body: { newusername: "", password: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/profil/change/username', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."})
                return true;
            }

            if(!await dataManager.checkPassword(req.session.username, req.body.password)) {
                res.json({"State": "404", "Message": "Das Passwort ist inkorrekt."})
                return true;
            }

            let response;
            if(await dataManager.setUsername(req.session.username, req.body.newusername)) {
                response = {"State": "200", "Message": "Der Benutzername wurde erfolgreich geändert."};
            } else {
                response = {"State": "404", "Message": "Der Benutzer existiert bereits."};
            }
            req.session.username = req.body.newusername;
            res.json(response);
        });
    }
}

module.exports = ProfilRoute;