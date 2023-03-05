const AbstractRoute = require('./AbstractRoute');

const DataManager = require('../../handler/DataHandler');
const dataManager = new DataManager();

class LogoutRoute extends AbstractRoute {

    initialize() {
        /**
         * GET
         * Logout user
         * Redirect to login
         */
        this.app.get('/logout', async function(req, res) {
                if(await dataManager.isLoggedIn(req.session.username)) {
                    req.session.destroy();
                }

                res.redirect("/login");
        });
    }
}

module.exports = LogoutRoute;