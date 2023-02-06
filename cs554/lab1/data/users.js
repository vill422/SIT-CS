const mongoCollections = require("../config/mongoCollections");
const user_collection = mongoCollections.users;
const { ObjectId } = require('mongodb');

const helpers = require("../helpers");

const bcrypt = require('bcrypt');
const saltRounds = 16;

const createUser = async (
    name, username, password
) => {
    try {
        name = helpers.nameCheck(name);
        username = helpers.usernameCheck(username);
        password = helpers.passwordCheck(password);

        const userCollection = await user_collection();
        const user = await userCollection.findOne({ username: username });

        // check if username already exists
        if (user !== null) {
            throw "Username already exists";
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const newUser = {
            name: name,
            username: username,
            password: hash,
        }

        // insert the new user into the database
        const insertInfo = await userCollection.insertOne(newUser);

        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw 'Could not add user';

        const newId = insertInfo.insertedId.toString();
        const returnNewUser = await getUserById(newId);

        return { insertedUser: true, user: returnNewUser };
    }
    catch (e) {
        throw e;
    }
};

const checkUser = async (username, password) => {
    try {
        username = helpers.usernameCheck(username);
        password = helpers.passwordCheck(password);

        const userCollection = await user_collection();
        const user = await userCollection.findOne({
            username: username
        })

        if (user === null) {
            throw "Either the username or password is invalid";
        }

        // use bcrypt to compare the hashed password in the database with the password input parameter.
        let compareToSherlock = false;
        try {
            compareToSherlock = await bcrypt.compare(password, user.password);
        } catch (e) {
            //no op
        }
        if (compareToSherlock === false) {
            throw "Either the username or password is invalid";
        }
        user._id = user._id.toString();
        delete user.password;
        return { authenticatedUser: true, user: user };
    } catch (e) {
        throw e;
    }
};

const getUserById = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    if (id.trim().length === 0) throw 'id must not be empty';

    id = id.trim();
    const userCollection = await user_collection();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw 'User not found';
    user._id = user._id.toString();
    delete user.password;
    return user;
}

module.exports = { createUser, checkUser };