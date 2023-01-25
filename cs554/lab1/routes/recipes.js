const express = require('express');
const router = express.Router();
const data = require("../data");
const recipeData = data.recipes;
const helper = require("../helper");

router.get("/", async (req, res) => {

});

router.get("/:id", async (req, res) => {

});

router.post("/", async (req, res) => {

});

router.patch("/:id", async (req, res) => {

});

router.post("/:id/comments", async (req, res) => {

});

router.delete("/:recipeId/:commentId", async (req, res) => {

});

router.post("/:id/likes", async (req, res) => {

});
