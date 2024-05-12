const {
    login,
    register,
    getAllUsers,
    logOut,
    getUserStatus,
    updateUserStatus,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allUsers/:id", getAllUsers);
router.get("/logout/:id", logOut);
router.post("/getStatus", getUserStatus);
router.post("/updateStatus", updateUserStatus);

module.exports = router;
