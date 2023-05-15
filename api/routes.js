const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({todo: [
        "All Todos [get] /todos",
        "Search Todos [get] /todos/search",
        "Get Todo By Id [get] /todos/id",
        "Create Todo [post] /todos",
        "Update Todo [put] /todos/id",
        "Remove Todo By Id [delete] /todos/id",
    ],
    users: [
        "All Users [get] /users",
        "Get User By Id [get] /user/id",
        "Create User [post] /user",
        "Update User [put] /user/id",
        "Remove User By Id [delete] /user/id",
    ],
    auth: [
        "Register [post] /auth/register",
        "Login [post] /auth/login",
        "Change Password [post] /auth/change",
        "Forgot Password [post] /auth/forgot",
        "Reset Password [post] /auth/reset",
    ]});
});

module.exports = router;