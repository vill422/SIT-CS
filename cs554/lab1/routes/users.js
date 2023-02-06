const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;

const helpers = require("../helpers");

// Creates a new user in the system with the supplied detail and returns the created user document (sans password)
router.post("/signup", async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "You must provide data to create a user" });
            return;
        }
        const nameInput = req.body.name;
        const usernameInput = req.body.username;
        const passwordInput = req.body.password;
        // make sure that usernameInput and passwordInput are supplied in the req.body
        const name = helpers.nameCheck(nameInput);
        const userName = helpers.usernameCheck(usernameInput);
        const password = helpers.passwordCheck(passwordInput);

        const result = await userData.createUser(name, userName, password);

        if (result.insertedUser) {
            res.status(200).json(
                result.user
            );
        } else {
            res.status(500).json({ error: "User not created" });
        }
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.post("/login", async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "You must provide data to login" });
            return;
        }

        const usernameInput = req.body.username;
        const passwordInput = req.body.password;
        // make sure that usernameInput and passwordInput are supplied in the req.body
        const userName = helpers.usernameCheck(usernameInput);
        const password = helpers.passwordCheck(passwordInput);

        const result = await userData.checkUser(userName, password)
        if (result.authenticatedUser) {
            req.session._id = result.user._id;
            req.session.username = result.user.username;

            res.status(200).json(result.user);
        }
        else {
            res.status(403).json({ error: "User not authenticated" });
        }
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "User logged out" });
});

module.exports = router;