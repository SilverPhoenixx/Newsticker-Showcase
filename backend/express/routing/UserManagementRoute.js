const AbstractRoute = require('./AbstractRoute');

const DataManager = require('../../handler/DataHandler');
const dataManager = new DataManager();

const path = require('path');

class ProfilRoute extends AbstractRoute {

    initialize() {
        /**
         * GET
         * Show user-management.html
         *
         * Redirect if not logged in
         */
        this.app.get('/user-management', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.redirect("/login");
                return true;
            }
            res.sendFile(path.resolve(__dirname + "/../../../frontend/user-management.html"));
        });

        /** GET
         * Get user list
         * Returns: {"users": []}
         */
        this.app.get('/user-management/user-list', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"users": []});
                return true;
            }
            res.json(await dataManager.getUserStringified());
        });

        /** POST
         * Add user by username with password (body: { username: "", password: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/user-management/user/add', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."});
                return true;
            }

            if(await dataManager.getUser(req.body.username) != null) {
                res.json({"State": "404", "Message": "Der Benutzername existiert bereits."});
                return true;
            }

            if(await dataManager.addUser(req.body.username, req.body.password)) {
                res.json({"State": "200", "Message": "Der Benutzer wurde erfolgreich hinzugefügt"});
                return true;
            } else {
                res.json({"State": "404", "Message": "Ein Fehler ist bei dem Hinzufügen aufgetreten."});
                return true;
            }
        });

        /** POST
         * Delete the user by username (body: { username: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/user-management/user/delete', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."});
                return true;
            }

            if(await dataManager.removeUser(req.body.username)) {
                res.json({"State": "200", "Message": "Der Benutzer wurde erfolgreich entfernt"});
                return true;
            } else {
                res.json({"State": "404", "Message": "Ein Fehler ist bei dem Entfernen aufgetreten."});
                return true;
            }
        });
    }
}

module.exports = ProfilRoute;