const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/empresaController");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/authenticate");

router.get("/empresa/profile", auth, empresaController.getProfile);
router.get("/empresa/id/:id", empresaController.getProfileByID);

router.put(
  "/empresa/profile",
  auth,
  upload.single("image"),
  empresaController.updateProfile
);
router.delete("/empresa/profile", auth, empresaController.deleteProfile);

module.exports = router;
