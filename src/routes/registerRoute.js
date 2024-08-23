const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const empresaController = require("../controllers/empresaController");
const upload = require("../middlewares/multer");

router.post("/user/register", upload.single("image"), userController.register);

router.post("/empresa/register", empresaController.register);

module.exports = router;




