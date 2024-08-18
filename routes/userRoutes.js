const express = require("express");
const authService = require("../services/authService");

const {
  getUserValidator,
  createUserValidator,
  deletUserValidator,
  updateUserValidator,
  changeUserpasswordValidator,
  updateUserLoggedValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deletUser,
  UploadUserImage,
  resizeimage,
  changeUserPassword,
  getLoggedUserData,
  UpdateUserLoggedPassword,
  UpdateLoggedUserData,
  deletUserLoggedData,
} = require("../services/userService");

const router = express.Router();

router.use(authService.protect);
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changemypassword", UpdateUserLoggedPassword);
router.put("/updatemydata", updateUserLoggedValidator, UpdateLoggedUserData);
router.delete("/deletme", deletUserLoggedData);

// admin
router.use(authService.allowedTo("admin", "manager"));
router.put(
  "/changePassword/:id",
  changeUserpasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(UploadUserImage, resizeimage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(UploadUserImage, resizeimage, updateUserValidator, updateUser)
  .delete(deletUserValidator, deletUser);

module.exports = router;
