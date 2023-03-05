const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const https = require("https");
const cors = require('cors')

const path = require('path');
const fs = require("fs");
const cert = fs.readFileSync(__dirname + "/certificates/server.cert");
const key = fs.readFileSync(__dirname + "/certificates/server.key");

const NewsRoute = require("./routing/NewsRoute");
const LoginRoute = require("./routing/LoginRoute");
const LogoutRoute = require("./routing/LogoutRoute");
const ProfilRoute = require("./routing/ProfilRoute");

const UserManagementRoute = require("./routing/UserManagementRoute");
const NewsManagementRoute = require("./routing/NewsManagementRoute");

const DataManager = require('../handler/DataHandler');
const dataManager = new DataManager();


class ExpressConnector {

     constructor() {
        this.app = express();

         /**
          * Load express and session configuration
          */
        this.loadApp();

         /**
          * Add user if no user exists (with username = root and standard password from news.xml
          */
        dataManager.initUser();

         /**
          * GET "/"
          * GET "/news/add"
          * GET "/news/edit"
          * GET "/news/list"
          * GET "/news/get/:title"
          * POST "/news/add" = body: { title: "", content: ""}
          * POST "/news/delete" = body: { title: ""}
          * POST "/news/edit" = body: { title: "", newtitle: "", content: ""}
          */
        this.newsRoute = new NewsRoute(this.app);

        /**
         * GET "/login"
         * POST "/login/authenticate"
         */
        this.loginRoute = new LoginRoute(this.app);

        /**
         * POST "/logout"
         */
        this.logoutRoute = new LogoutRoute(this.app);

        /**
         * GET "/profil"
         * POST "/profil/change/password"
         * POST "/profil/change/username"
         */
        this.profilRoute = new ProfilRoute(this.app);

        /**
         * GET "/user-management"
         * GET "/user-management/user-list"
         * POST "/user-management/user/add" = body: { username: "", password: ""}
         * POST "/user-management/user/delete" = body: { username: ""}
         */
        this.userManagementRoute = new UserManagementRoute(this.app);

        /**
         * GET "/news-management"
         */
        this.newsManagementRoute = new NewsManagementRoute(this.app);
    }

    loadApp() {
        this.app.use(session(this.getSessionConfiguration()));

        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(cookieParser());

        /**
         * Create static folder for images and js files
         */
        this.app.use(express.static(path.resolve(__dirname + "/../../frontend/public")));
        https.createServer({key: key, cert: cert}, this.app).listen(3000);
    }

    getSessionConfiguration() {
        const days = 7 * 1000 * 60 * 60 * 24;
        return {
            secret: "200820012210202104032001",
            name: "Nachrichten Ticker",
            saveUninitialized: true,
            secure: true,
            cookie: { maxAge: days },
            resave: false,
        }
    }
}

module.exports = ExpressConnector;