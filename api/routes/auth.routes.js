const {register, authenticate, reset, forgot, changePassword, verify} = require("../controllers/AuthController");
const router = require("../routes");

router.post("/auth/register", register);
router.post("/auth/login", authenticate);
router.post("/auth/reset", reset);
router.post("/auth/forgot", forgot);
router.post("/auth/change", changePassword);
router.get("/auth/verify", verify);

module.exports = router;
