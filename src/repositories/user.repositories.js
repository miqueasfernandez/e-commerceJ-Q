import UserDao from "../dao/user.dao.js";

class userRepositories {

    async createUser(userdata) {
        return await UserDao.save(userdata);
    }

    async getUserById(id) {
        return await UserDao.findById(id);
    }

    async getUserByUsername(username) {
        return await UserDao.findOne({ username });
    }
}

export default new userRepositories()