const fs = require('fs');
const bcrypt = require("bcrypt");
const {XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");

class XMLHandler {

     constructor() {
             this.json = this.loadXML();
    }

    /**
     * Get the JSON
     * @returns JSON of news.xml
     */
    getJSON() {
        return this.json;
    }


    /**
     * Load and Parse JSON from XML
     * @returns JSON
     */
     loadXML() {
        const data = fs.readFileSync(__dirname + "/../data/news.xml");
        const parser = new XMLParser();
        return parser.parse(data);
    }

    /**
     * Write JSON to XML
     */
    createXMLFromJSON(json) {
        const builder = new XMLBuilder();
        const xmlContent = builder.build(json);
        fs.writeFileSync(__dirname + "/../data/news.xml", xmlContent);
    }

    /**
     * Get newsList from JSON
     * @returns newsList
     */
    getAllNews() {
        return this.getJSON().data?.newsList;
    }

    /**
     * Create JSON Object
     * @returns {news: []}
     */
    getNewsStringified() {
        if(this.getJSON().data?.newsList?.news === undefined) {
            return {"news": []};
        }
        if(this.getJSON().data.newsList.news instanceof Array) {
            return {"news": this.getJSON().data.newsList.news};
        }
        return {"news": [{"title": this.getJSON().data?.newsList.news.title, "content": this.getJSON().data?.newsList.news.content}]};
    }

    /**
     * Add news to JSON and save as XML
     * @param title from news and index
     * @param content that descripted what happend
     * @returns true when added and false when news exists
     */
    async addNews(title, content) {
        let news = await this.getNews(title);
        if (news != null) return false;
        if(this.getAllNews().news instanceof Array) {
            this.getAllNews().news.push({"title": title, "content": content});
        } else if (this.getAllNews().news instanceof Object) {
            const news = this.getAllNews();
            this.getJSON().data.newsList = {
                "news": [{
                    "title": news.news.title,
                    "content": news.news.content
                }, {"title": title, "content": content}]
            };
        } else {
            this.getJSON().data.newsList = {"news": {"title": title, "content": content}};
        }
        this.createXMLFromJSON(this.getJSON());
        return true;
    }

    /**
     * Remove news by title
     * @param title of the removed news
     * @returns true when removed and false when not found
     */
    async removeNews(title) {
        let news = await this.getNews(title);
        if (news == null) return false;

        if(this.getAllNews().news instanceof Array) {
            let index = this.getNewsIndex(title);
            this.getAllNews().news.splice(index, 1);
            this.createXMLFromJSON(this.getJSON());
            return true;
        }

        this.getAllNews().news = [];
        this.createXMLFromJSON(this.getJSON());
        return true;
    }

    /**
     * Get News by title
     * @param title of the news
     * @returns {title: "", content: ""} or null if not found
     */
    async getNews(title) {
        if(this.getAllNews().news === undefined) return null;
        if(this.getAllNews().news instanceof Array) {
            for (let i = 0; i < this.getAllNews().news.length; i++) {
                if (this.getAllNews().news[i].title == title) {
                    return this.getAllNews().news[i];
                }
            }
        } else {
            if(this.getAllNews().news.title == title) return this.getAllNews().news;
        }
        return null;
    }

    /**
     * Get index of news by title
     * @param title of the news
     * @returns index if not null and return null when not found
     */
    getNewsIndex(title) {
        for (let i = 0; i < this.getAllNews().news.length; i++)
            if (this.getAllNews().news[i].title === title) return i;
        return null;
    }

    /** ASYNC
     * Update news by title
     * @param title of the news what you want to update
     * @param newtitle of the news (or give the same name if you just want to update the content)
     * @param content of the news
     * @returns return true when updated and false when news doesn't exist
     */
    async updateNews(title, newtitle, content) {
        const news = await this.getNews(title);
        if (news == null) return false;


        if(this.getAllNews().news instanceof Array) {
            const index = this.getNewsIndex(title);
            this.getAllNews().news[index].title = newtitle;
            this.getAllNews().news[index].content = content;
            this.createXMLFromJSON(this.json);
            return true;
        }

        this.getAllNews().news.title = newtitle;
        this.getAllNews().news.content = content;
        this.createXMLFromJSON(this.json);
        return true;
    }

    /**
     * Get users from JSON
     * @returns users
     */
    getUsers() {
        return this.getJSON().data?.users;
    }

    /**
     * Create JSON Object and load users without password hash
     * @returns {users: []}
     */
    getUserStringified() {

        if(this.getJSON()?.data?.users?.user === undefined) {
            return {"users": []};
        }

        if(this.getJSON().data.users.user instanceof Array) {

            let users = {"users": []};
            for(let index in this.getJSON().data.users.user) {
                users.users.push({"username": this.getJSON().data.users.user[index].username})
            }

            return users;
        }
        return {"users": [{"username": this.getJSON().data.users.user.username}]};
    }

    /**
     * Add user to JSON and save as XML
     * @param username from news and index
     * @param password of the account (password gets encrypted by bcrypt with salt 10)
     * @returns true when added and false when news exists
     */
    async addUser(username, password) {
        let user = await this.getUser(username);
        if (user != null) return false;

        const hash = bcrypt.hashSync(password, 10);

        if(this.getUsers().user instanceof Array) {
            this.getUsers().user.push({username, "password": hash});
        } else if (this.getUsers().user instanceof Object) {
            const user = this.getUsers();
            this.getJSON().data.users = {
                "user": [{
                    "username": user.user.username,
                    "password": user.user.password
                }, {"username": username, "password": hash}]
            };
        } else {
            this.getJSON().data.users = {"user": {username, "password": hash}};
        }
        this.createXMLFromJSON(this.getJSON());
        return true;
    }

    /**
     * Remove user by username
     * If only one user exist you cant remove it
     * @param username of the removed user
     * @returns true when removed and false when not found
     */
    async removeUser(username) {
        let user = await this.getUser(username);
        if (user == null) return false;

        if(this.getUsers().user instanceof Array) {
            let index = this.getUserIndex(username);
            this.getUsers().user.splice(index, 1);
            this.createXMLFromJSON(this.getJSON());
            return true;
        }

        return false;
    }

    /**
     * Initialize the default user (password get be set in the news.xml at: data - configuration - standardpassword)
     * The default user gets loaded if no user exists
     */
    initUser() {
        if(!(this.getUsers().user instanceof Array)) {
             this.addUser("root", this.getJSON().data.configuration.standardPassword);
        }
    }

    /**
     * Get User by username
     * @param username of the user
     * @returns {title: "", content: ""} or null if not found
     */
    async getUser(username) {
        if(this.getUsers().user === undefined) return null;

        if(this.getUsers().user instanceof Array) {
            for (let i = 0; i < this.getUsers().user.length; i++)
                if (this.getUsers().user[i].username == username) {
                    return this.getUsers().user[i];
                }
        } else {
            if(this.getUsers().user.username == username) return this.getUsers().user;
            return null;
        }
        return null;
    }

    /**
     * Get index of user by username
     * @param user of the username
     * @returns index if not null and return null when not found
     */
    getUserIndex(username) {
        for (let i = 0; i < this.getUsers().user.length; i++)
            if (this.getUsers().user[i].username === username) return i;
        return null;
    }

    /**
     * Set password of the user
     * @param username of the current user
     * @param password new password (get encrypted with bcrypt salt: 10)
     * @returns true when password is set and false when user dont exist
     */
    async setPassword(username, password) {
        const user = await this.getUser(username);
        if (user == null) return false;

        const index = this.getUserIndex(username);


        const hash = bcrypt.hashSync(password, 10);

        if(!(this.getUsers() instanceof Array)) {
            this.getUsers().user.password = hash;
            this.createXMLFromJSON(this.json);
            return true;
        }

        this.getUsers().user[index].password = hash;
        this.createXMLFromJSON(this.json);
        return true;
    }

    /**
     * check password hash of the current user with inputted password
     * @param username of the current user
     * @param password to be checked
     * @returns true when password is same and false when not same
     */
    async checkPassword(username, password) {
        const user = await this.getUser(username);
        const match = await bcrypt.compare(password, user.password);
        return match;
    }

    /**
     * Check if the user exists in JSON
     * @param username of the current user
     * @returns true when exist and false when not
     */
    async isLoggedIn(username) {
        const user = await this.getUser(username);
        if (user != null) return true;
        return false;
    }

    /**
     * Set username by userame
     * @param username of the current user
     * @param newusername of the current user
     * @returns true when password is set and false when user don't exist
     */
    async setUsername(username, newusername) {
        const user = await this.getUser(username);
        if (user == null) return false;

        const index = this.getUserIndex(username);

        if (!(this.getUsers() instanceof Array)) {
            this.getUsers().user.username = newusername;
            this.createXMLFromJSON(this.json);
            return true;
        }

        this.getUsers().user[index].username = newusername;
        this.createXMLFromJSON(this.json);
        return true;
    }
}

module.exports = XMLHandler;