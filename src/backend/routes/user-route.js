const express = require("express");
const router = express.Router();

const userController = require("../controller/user-controller.js");

router.post("/register", userController.createUser);

router.post("/login", userController.userLogin);

router.post("/logout", userController.userLogout);

router.get("/getUsers", userController.getUsers);

router.get("/getUsers/:id", userController.getUser);

router.put("/update/:id", userController.updateProfile);

router.delete("/delete/:id", userController.deleteProfile);

module.exports = router;