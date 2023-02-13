const express=require("express");
const { registerUser, loginUser, logout, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUserDetail, updateUser, deleteUser } = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router=express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUserDetail)
router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUser)
router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)



module.exports=router