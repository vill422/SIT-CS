const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}))

//  middleware

// 3. apply to the entire application and will log all request bodies
app.use(async (req, res, next) => {
    if (!req.body) {
        next();
    }
    else {
        if (req.body.password) {
            const info = Object.create(req.body);
            delete info.password;
            console.log(info);
        }
        else {
            console.log(req.body);
        }
        console.log("url: " + req.url);
        console.log("method: " + req.method);
        next();
    }
})

//  4. keep track of how many times a particular URL has been requested, updating and logging with each request.
app.use(async (req, res, next) => {
    if (!req.session.urlCount) {
        req.session.urlCount = {};
    }
    if (!req.session.urlCount[req.url]) {
        req.session.urlCount[req.url] = 1;
    }
    else {
        req.session.urlCount[req.url]++;
    }
    console.log(req.session.urlCount);
    next();
})

//  1. applied to the POST, PUT and PATCH routes for the /recipes endpoint that will check if there is a logged in use
app.use("/recipes", async (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        if (req.session.username) {
            next();
        }
        else {
            res.status(403).json({ error: "User not authenticated" });
        }
    }
    else {
        next();
    }
})

// 2.applied to POST and DELETE for the /recipes/:id/comments and /recipes/:recipeId/:commentId
app.use(["/recipes/:id/comments", "/recipes/:recipeId/:commentId"], async (req, res, next) => {
    if (req.method === "POST" || req.method === "DELETE") {
        if (req.session.username) {
            next();
        }
        else {
            res.status(403).json({ error: "User not authenticated" });
        }
    }
    else {
        next();
    }
})



configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
