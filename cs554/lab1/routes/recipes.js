const express = require('express');
const router = express.Router();
const data = require("../data");
const recipeData = data.recipes;
const { ObjectId } = require('mongodb');
const helpers = require("../helpers");
const session = require('express-session');

// By default, it will show the first 50 recipes in the collection
router.get("/", async (req, res) => {
    try {
        let page = 1;
        if (req.query.page === undefined) {
            page = 1;
        }
        else {
            page = req.query.page;
        }
        const recipeList = await recipeData.getAllRecipes(page);
        res.status(200).json(recipeList);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/:id", async (req, res) => {
    try {
        helpers.isIDvalid(req.params.id);
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        const recipe = await recipeData.getrecipeById(req.params.id);
        res.status(200).json(recipe);
    } catch (e) {
        res.status(404).json({ error: "Recipe not found" });
    }
});

router.post("/", async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "You must provide data to create a recipe" });
            return;
        }
        if (!req.body.title) {
            res.status(400).json({ error: "You must provide a title" });
            return;
        }
        if (!req.body.ingredients) {
            res.status(400).json({ error: "You must provide ingredients" });
            return;
        }
        if (!req.body.steps) {
            res.status(400).json({ error: "You must provide steps" });
            return;
        }
        if (!req.body.cookingSkillRequired) {
            res.status(400).json({ error: "You must provide a cooking skill required" });
            return;
        }

        const titleInput = req.body.title;;
        const ingredientsInput = req.body.ingredients;
        const stepsInput = req.body.steps;
        const cookingSkillRequiredInput = req.body.cookingSkillRequired;
        title = helpers.isTitleValid(titleInput);
        ingredients = helpers.isIngredientsValid(ingredientsInput);
        steps = helpers.isStepsValid(stepsInput);
        cookingSkillRequired = helpers.isCookingSkillRequiredValid(cookingSkillRequiredInput);

        const userThatPosted = { _id: ObjectId(req.session._id), username: req.session.username };
        const newRecipe = await recipeData.addRecipe(title, ingredients, cookingSkillRequired, steps, userThatPosted);
        res.status(200).json(newRecipe);
    } catch (e) {
        res.status(400).json({ error: e });
    }

});

router.patch("/:id", async (req, res) => {
    const updatedData = req.body;
    try {
        helpers.isIDvalid(req.params.id);
    }
    catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        //  A user has to be logged in to update a recipe AND they must be the same user who originally posted the recipe. 
        const recipe = await recipeData.getrecipeById(req.params.id);

        if (req.session._id !== recipe.userThatPosted._id) {
            throw "You are not authorized to update this recipe";
        }
        const updatedRecipe = await recipeData.updateRecipe(req.params.id, updatedData);
        res.status(200).json(updatedRecipe);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/:id/comments", async (req, res) => {
    try {
        helpers.isIDvalid(req.params.id);
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        if (!req.body) {
            res.status(400).json({ error: "You must provide data to create a comment" });
            return;
        }
        if (!req.body.comment) {
            res.status(400).json({ error: "You must provide a comment" });
            return;
        }
        const commentInput = req.body.comment;
        comment = helpers.isCommentValid(commentInput);
        const userThatPostedComment = { _id: req.session._id, username: req.session.username };
        const newComment = await recipeData.addComment(req.params.id, comment, userThatPostedComment);
        res.status(200).json(newComment);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

router.delete("/:recipeId/:commentId", async (req, res) => {
    try {
        helpers.isIDvalid(req.params.recipeId);
        helpers.isIDvalid(req.params.commentId);
    }
    catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        const recipe = await recipeData.removeComment(req.params.recipeId, req.params.commentId);
        res.status(202).json(recipe);
    }
    catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/:id/likes", async (req, res) => {
    try {
        helpers.isIDvalid(req.params.id);
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        const userThatLiked = req.session._id;
        const recipe = await recipeData.addLike(req.params.id, userThatLiked);
        res.status(200).json(recipe);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

module.exports = router;