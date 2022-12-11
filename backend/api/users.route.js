import express from "express"
import usersCtrl from "./users.controller.js"
import computersCtrl from "./computers.controller.js"
import ordersCtrl from "./orders.controller.js"

const router = express.Router()

router.route("/").get((req, res) => res.send("hello world"))

router
    .route("/user")
    .get(usersCtrl.apiGetUsers)
    .post(usersCtrl.apiPostUser)
    .put(usersCtrl.apiUpdateUser)
    .delete(usersCtrl.apiDeleteUser)

router
    .route("/computers")
    .get(computersCtrl.apiGetComputers)
    .post(computersCtrl.apiPostComputer)
    .put(computersCtrl.apiUpdateComputer)
    .delete(computersCtrl.apiDeleteComputer)

router
    .route("/orders")
    .get(ordersCtrl.apiGetOrders)
    .post(ordersCtrl.apiPostOrder)
    .put(ordersCtrl.apiUpdateOrder)
    .delete(ordersCtrl.apiDeleteOrder)

export default router