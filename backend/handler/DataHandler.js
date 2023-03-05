const XMLReader = require('./XMLHandler');
const dataHolder = new XMLReader();

class DataHandler {

    /**
     * Initialize the default user (password get be set in the news.xml at: data - configuration - standardpassword)
     * The default user gets loaded if no user exists
     */
    initUser() {
        dataHolder.initUser();
    }

    /**
     * Create JSON Object
     * @returns {news: []}
     */
    getNewsStringified() {
        return dataHolder.getNewsStringified(); }

    /**
     * Create JSON Object and load users without password hash
     * @returns {users: []}
     */
    getUserStringified() {
        return dataHolder.getUserStringified();
    }

    /** ASYNC
     * Get User by username
     * @param username of the user
     * @returns {title: "", content: ""} or null if not found
     */
    getUser(username) {
        return dataHolder.getUser(username);
    }

    /** ASYNC
     * Get News by title
     * @param title of the news
     * @returns {title: "", content: ""} or null if not found
     */
    getNews(title) {
        return dataHolder.getNews(title);
    }

    /** ASYNC
     * Add user to dataholder
     * @param username from news and index
     * @param password of the account (password gets encrypted by bcrypt with salt 10)
     * @returns true when added and false when news exists
     */
    addUser(username, password) {
        return dataHolder.addUser(username, password); }

    /** ASYNC
     * Add news to dataholder
     * @param title from news and index
     * @param content that descripted what happend
     * @returns true when added and false when news exists
     */
    addNews(title, content) {
        return dataHolder.addNews(title, content);
    }

    /** ASYNC
     * Remove news by title
     * @param title of the removed news
     * @returns true when removed and false when not found
     */
    removeNews(title) {
        return dataHolder.removeNews(title);
    }

    /** ASYNC
     * Update news by title
     * @param title of the news what you want to update
     * @param newtitle of the news (or give the same name if you just want to update the content)
     * @param content of the news
     * @returns return true when updated and false when news doesn't exist
     */
    updateNews(title, newtitle, content) {
        return dataHolder.updateNews(title, newtitle, content);
    }

    /** ASYNC
     * Remove user by username
     * If only one user exist you cant remove it
     * @param username of the removed user
     * @returns true when removed and false when not found
     */
    removeUser(username) {
        return dataHolder.removeUser(username);
    }

    /** ASYNC
     * Set username by userame
     * @param username of the current user
     * @param newusername of the current user
     * @returns true when password is set and false when user don't exist
     */
    setUsername(username, newEmail) {
        return dataHolder.setUsername(username, newEmail);
    }

    /** ASYNC
     * Set password of the user
     * @param username of the current user
     * @param password new password (get encrypted with bcrypt salt: 10)
     * @returns true when password is set and false when user don't exist
     */
    setPassword(username, password) {
        return dataHolder.setPassword(username, password);
    }

    /** ASYNC
     * check password hash of the current user with inputted password
     * @param username of the current user
     * @param password to be checked
     * @returns true when password is same and false when not same
     */
     checkPassword(username, password) {
       return dataHolder.checkPassword(username, password);
    }

    /** ASYNC
     * Check if the user exists
     * @param username of the current user
     * @returns true when exist and false when not
     */
     isLoggedIn(username) {
        return dataHolder.isLoggedIn(username);
    }

}

module.exports = DataHandler;