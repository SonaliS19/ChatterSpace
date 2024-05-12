const {
    addMessage,
    getMessages,
    getLLMResponse,
} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.get("/getLLMResponse", getLLMResponse);

module.exports = router;
