const recipesRoutes = require("./recipes");
const usersRoutes = require("./users");

const constructorMethod = (app) => {

    app.use("/recipes", recipesRoutes);

    app.use("/", usersRoutes);

    app.use("*", (req, res) => {
        res.status(404).send("Page not found");
    });
};

module.exports = constructorMethod;