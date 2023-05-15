const {getUsers, getUser, createUser, editUser, removeUser} = require("../controllers/UserController");
const router = require("express").Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUser);
router.put("/:userId", editUser);
router.delete("/", removeUser);

module.exports = router;