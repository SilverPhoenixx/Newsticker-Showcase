const AbstractRoute = require('./AbstractRoute');

const DataManager = require('../../handler/DataHandler');
const dataManager = new DataManager();

const path = require('path');

class LoginRoute extends AbstractRoute {

    initialize() {
        /**
         * GET
         * Show login.html
         *
         * Redirect to login if not logged in
         */
        this.app.get('/login', async function(req, res) {
                if(await dataManager.isLoggedIn(req.session.username)) {
                    res.redirect("/profil");
                    return;
                }

                res.sendFile(path.resolve(__dirname + "/../../../frontend/login.html"));
        });

        /** POST
         * Authicate user by username and password (body: { username: "", password: ""})
         * Returns JSON ({"State": "", Message: ""})
         * Create Session
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/login/authenticate', async function(req, res) {
            const user = await dataManager.getUser(req.body.username);

            if(user == null) {
                res.json({"Message": "Die E-Mail oder das Password ist falsch.", "State": "404"});
                return;
            }

            if(!await dataManager.checkPassword(req.body.username, req.body.password)) {
                res.json({"Message": "Die E-Mail oder das Password ist falsch.", "State": "404"});
                return;
            }
            req.session.username = user.username;
            res.json({"State": "200"});
    });
    }
}

module.exports = LoginRoute;