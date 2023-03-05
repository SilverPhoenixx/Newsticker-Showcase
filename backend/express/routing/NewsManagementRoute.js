const AbstractRoute = require('./AbstractRoute');

const DataManager = require('../../handler/DataHandler');
const dataManager = new DataManager();

const path = require('path');

class NewsManagementRoute extends AbstractRoute {

    initialize() {
        /**
         * GET
         * Show news-management.html
         *
         * Redirect if not logged in
         */
        this.app.get('/news-management', async function(req, res) {
            if(!await dataManager.isLoggedIn(req.session.username)) {
                res.redirect("/login");
                return;
            }

            res.sendFile(path.resolve(__dirname + "/../../../frontend/news-management.html"));
        });
    }
}

module.exports = NewsManagementRoute;