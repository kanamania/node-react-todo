const {getAll, searchTodos, getTodo, createTodo, editTodo, removeTodo, inviteTodo, toggleTodo, deleteInviteTodo} = require("../controllers/TodoController");
const router = require("express").Router();

router.get("/", getAll);
router.get("/search", searchTodos);
router.get("/:todoId", getTodo);
router.post("/", createTodo);
router.put("/:todoId", editTodo);
router.post("/toggle", toggleTodo);
router.post("/invite/:todoId", inviteTodo);
router.delete("/invite/:todoId/:userId", deleteInviteTodo);
router.delete("/:todoId", removeTodo);

module.exports = router;