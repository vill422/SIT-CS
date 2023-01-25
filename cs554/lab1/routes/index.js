const recipes = require("./recipes");
const routesAPI = require("./routesAPI");

const constructorMethod = (app) => {

    app.use('/recipes', recipes);

    app.use("/", routesAPI);

    app.use('*', (req, res) => {
        res.status(404).send("Page not found");
    });
};

module.exports = constructorMethod;