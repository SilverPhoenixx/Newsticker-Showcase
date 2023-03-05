const AbstractRoute = require('./AbstractRoute');
const DataManager = require('../../handler/DataHandler');
const dataManager = new DataManager();
const path = require('path');

class NewsRoute extends AbstractRoute {

    initialize() {

        /**
         * GET
         * Show index.html
         */
        this.app.get('/', function (req, res) {
            res.sendFile(path.resolve(__dirname + "/../../../frontend/index.html"));
        });

        /**
         * GET
         * Show news-add.html
         *
         * Redirect to login if not logged in
         */
        this.app.get("/news/add", async function (req, res) {
            if (!await dataManager.isLoggedIn(req.session.username)) {
                res.redirect("/login");
                return;
            }
            res.sendFile(path.resolve(__dirname + "/../../../frontend/news-add.html"));
        });

        /**
         * GET
         * Show news-edit.html
         *
         * Redirect to login if not logged in
         */
        this.app.get("/news/edit", async function (req, res) {
            if (!await dataManager.isLoggedIn(req.session.username)) {
                res.redirect("/login");
                return;
            }
            res.sendFile(path.resolve(__dirname + "/../../../frontend/news-edit.html"));
        });

        /**
         * GET
         * Returns JSON {"news": []}
         */
        this.app.get('/news/list', async function (req, res) {
            let data = await dataManager.getNewsStringified();
            res.json(data);
        });

        /**
         * GET
         * Returns JSON {"title": "", content: ""}
         */
        this.app.get('/news/get/:title', async function (req, res) {
            const title = req.params.title;
            const news = await dataManager.getNews(title);
            if (news != null) return res.json(news);
            return res.json({});
        });

        /** POST
         * Add new news (body: { title: "", content: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/news/add', async function (req, res) {
            if (!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."});
                return true;
            }

            if (await dataManager.getNews(req.body.title) != null) {
                res.json({"State": "404", "Message": "Die Neuigkeit existiert bereits."});
                return true;
            }

            if (await dataManager.addNews(req.body.title, req.body.content)) {
                res.json({"State": "200", "Message": "Die Neuigkeit wurde erfolgreich hinzugefügt"});
                return true;
            } else {
                res.json({"State": "404", "Message": "Ein Fehler ist bei dem Hinzufügen aufgetreten."});
                return true;
            }
        });

        /** POST
         * Delete news by title (body: { title: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/news/delete', async function (req, res) {
            if (!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."});
                return true;
            }

            if (await dataManager.getNews(req.body.title) == null) {
                res.json({"State": "404", "Message": "Die Neuigkeit existiert nicht."});
                return true;
            }

            if (await dataManager.removeNews(req.body.title)) {
                res.json({"State": "200", "Message": "Die Neuigkeit wurde erfolgreich entfernt"});
                return true;
            } else {
                res.json({"State": "404", "Message": "Ein Fehler ist bei dem Entfernen aufgetreten."});
                return true;
            }
        });

        /** POST
         * Update news by title with content (body: { title: "", newtitle: "", content: ""})
         * Returns JSON ({"State": "", Message: ""})
         * State 404 when Error
         * State 200 when Succeed
         * Message information for user
         */
        this.app.post('/news/edit', async function (req, res) {
            if (!await dataManager.isLoggedIn(req.session.username)) {
                res.json({"State": "404", "Message": "Logge dich erneut ein."});
                return true;
            }

            if (await dataManager.getNews(req.body.title) == null) {
                res.json({"State": "404", "Message": "Die Neuigkeit existiert nicht."});
                return true;
            }

            if (await dataManager.updateNews(req.body.title, req.body.newtitle, req.body.content)) {
                res.json({"State": "200", "Message": "Die Neuigkeit wurde erfolgreich bearbeitet"});
                return true;
            } else {
                res.json({"State": "404", "Message": "Ein Fehler ist bei dem Bearbeiten aufgetreten."});
                return true;
            }
        });
    }
}

module.exports = NewsRoute;