const express=require("express");
const { newOrder, getSingleOrder, getMyOrder, getOrder, updateOrder, deleteOrder } = require("../controller/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/orders/me").get(isAuthenticatedUser,getMyOrder);
router.route("/orders/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getOrder);
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)




module.exports = router;