const express = require("express");
const router = express.Router();
const userController = require("../controllers/login");
const empresaController = require("../controllers/empresaController");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/authenticate");

router.post("/user/register", upload.single("image"), userController.register);

router.post("/empresa/register", empresaController.register);

router.get("/empresa/profile", auth, empresaController.getProfile);

router.put(
  "/empresa/profile",
  auth,
  upload.single("image"),
  empresaController.updateProfile
);

module.exports = router;
