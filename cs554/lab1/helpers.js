const { ObjectId } = require('mongodb');

let isIDvalid = (id) => {
    if (id === undefined) {
        throw "Must provide an id";
    }
    if (typeof id !== "string") {
        throw "Id must be a string";
    }
    if (id.trim().length === 0) {
        throw "Id cannot be empty";
    }
    if (!ObjectId.isValid(id)) {
        console.log("Invalid id");
        throw "Invalid id";
    }
    return id;
}

//  Must be a valid string.  No strings with empty spaces allowed.
let isTitleValid = (title) => {
    if (title === undefined) {
        throw "Must provide a title";
    }
    if (typeof title !== "string") {
        throw "Title must be a string";
    }
    if (title.trim().length === 0) {
        throw "Title cannot be empty";
    }
    return title;

};

// Each element must be a valid string, no strings with empty spaces and there should be at least 3 valid string elements in the array. 
// The minimum characters for each ingredient should be 3 characters and the max 50 characters.
let isIngredientsValid = (ingredients) => {
    if (ingredients === undefined) {
        throw "Must provide ingredients";
    }
    if (!Array.isArray(ingredients)) {
        throw "Ingredients must be an array";
    }
    if (ingredients.length < 3) {
        throw "Ingredients must have at least 3 elements";
    }
    if (ingredients.every((ingredient) => typeof ingredient !== "string")) {
        throw "Element in Ingredients must be strings";
    }
    if (ingredients.every((ingredient) => ingredient.trim().length === 0)) {
        throw "Element in Ingredients cannot be empty string";
    }
    if (ingredients.every((ingredient) => ingredient.length < 3 || ingredient.length > 50)) {
        throw "Element in Ingredients must be between 3 and 50 characters";
    }
    const reqIngredient = /[^a-zA-Z0-9./ ]/;
    if (ingredients.every((ingredient) => reqIngredient.test(ingredient))) {
        throw "Element in Ingredients must make sense";
    }

    if (ingredients.every((ingredient) => {
        const element = ingredient.split(" ");
        for (let i = 0; i < element.length; i++) {
            if (element[i].length >= 3) {
                for (let j = 0; j < element[i].length - 2; j++) {
                    if (element[i][j].toLowerCase() === element[i][j + 1].toLowerCase() && element[i][j].toLowerCase() === element[i][j + 2].toLowerCase()) {
                        return true;
                    }
                }
            }
        }
    })) {
        throw "Element in Ingredients must make sense";
    }
    return ingredients;
};

//  Each element must be a valid string, no strings with empty spaces and there should be at least 5 valid string elements in the array. 
//  The minimum number of characters should be 20.  No max character constraint. 
let isStepsValid = (steps) => {
    if (steps === undefined) {
        throw "Must provide steps";
    }
    if (!Array.isArray(steps)) {
        throw "Steps must be an array";
    }
    if (steps.length < 5) {
        throw "Steps must have at least 5 elements";
    }
    if (steps.every((step) => typeof step !== "string")) {
        throw "Element in Steps must be strings";
    }
    if (steps.every((step) => step.trim().length === 0)) {
        throw "Element in Steps cannot be empty string";
    }
    if (steps.every((step) => step.length < 20)) {
        throw "Element in Steps must be at least 20 characters";
    }
    const reqStep = /^[a-zA-Z0-9 ]$/;
    if (steps.every((step) => reqStep.test(step))) {
        throw "Element in Steps must make sense";
    }

    return steps;
};
//  ONLY allow the following value: "Novice", "Intermediate", "Advanced"
let isCookingSkillRequiredValid = (cookingSkillRequired) => {
    if (cookingSkillRequired === undefined) {
        throw "Must provide cookingSkillRequired";
    }
    if (typeof cookingSkillRequired !== "string") {
        throw "cookingSkillRequired must be a string";
    }
    if (cookingSkillRequired.trim().length === 0) {
        throw "cookingSkillRequired cannot be empty";
    }
    if (cookingSkillRequired !== "Novice" && cookingSkillRequired !== "Intermediate" && cookingSkillRequired !== "Advanced") {
        throw "cookingSkillRequired must be Novice, Intermediate, or Advanced";
    }
    return cookingSkillRequired;
};

const isCommentValid = (comment) => {
    if (comment === undefined) {
        throw "Must provide comment";
    }
    if (typeof comment !== "string") {
        throw "comment must be a string";
    }
    if (comment.trim().length === 0) {
        throw "comment cannot be empty";
    }
    return comment;
}

const nameCheck = (name) => {
    if (!name) throw "You must provide a name";
    if (typeof name !== "string") throw "Name must be a string";
    if (name.trim().length === 0) throw "Name cannot be empty";

    const regLastName = /^[a-zA-Z']*$/;
    const regFirstName = /^[a-zA-Z]*$/;
    let nameArray = name.trim().split(' ');
    if (nameArray.length !== 2) throw 'Name must have the following format "first name space last name"';
    let lastName = nameArray[1];
    let firstName = nameArray[0];
    if (firstName.length < 3) throw 'first name must be at least 3 characters long';
    if (lastName.length < 3) throw 'last name must be at least 3 characters long';
    if (regLastName.test(lastName) === false || regFirstName.test(firstName) === false)
        throw 'Name must only be letters a-z or A-Z.';
    return name;
};

// The username must be alphanumeric and at least 3 characters long
const usernameCheck = (username) => {
    // username must be supplied or you will throw an error
    if (!username) throw "You must provide a username";
    // For username, it should be a valid string
    if (typeof username !== "string") throw "Username must be a string";
    if (username.trim().length === 0) throw "Username cannot be empty";
    // at least 3 characters long
    if (username.length < 3) throw "Username must be at least 4 characters";
    // no empty spaces, no spaces in the username and only alphanumeric characters
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(username)) throw "Username must be alphanumeric";

    return username.toLowerCase();
}

// The password should be 6 characters minimum, with at least one lowercase letter, one uppercase letter, one number and one special character contained in it. 
const passwordCheck = (password) => {
    // password must be supplied or you will throw an error
    if (!password) throw "You must provide a password";
    // For the password, it must be a valid string
    if (typeof password !== "string") throw "Password must be a string";
    if (password.trim().length === 0) throw "Password cannot be empty";
    // at least 6 characters long
    if (password.length < 6) throw "Password must be at least 6 characters";
    // The constraints for password will be: There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character:
    const regex = / /;
    if (regex.test(password)) throw "Must no empty spaces and no spaces in password";

    const regexLowerCase = /[a-z]/;
    const regexUpperCase = /[A-Z]/;
    const regexNumber = /[0-9]/;
    const regexSpecialChar = /[!@#$%\^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!regexLowerCase.test(password) || !regexLowerCase.test(password) || !regexNumber.test(password) || !regexSpecialChar.test(password)) throw "Password must have at least one uppercase character, one number and one special character";

    return password;
}

module.exports = { isIDvalid, isTitleValid, isIngredientsValid, isStepsValid, isCookingSkillRequiredValid, isCommentValid, nameCheck, usernameCheck, passwordCheck };