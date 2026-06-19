const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/",
  authMiddleware,
  userController.getUsers
);

router.put(
  "/block/:id",
  authMiddleware,
  userController.toggleBlockUser
);

router.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser
);

module.exports = router;