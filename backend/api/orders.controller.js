import OrdersDAO from "../dao/ordersDAO.js"

export default class ordersCtrl {

    static async apiGetOrders (req, res, next) {

        const ordersPerPage = req.query.ordersPerPage ? parseInt(req.query.ordersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.start_date) {
            filters.start_date = req.query.start_date
        } else if (req.query.end_date) {
            filters.end_date = req.query.end_date
        }

        const {ordersList, totalNumOrders} = await OrdersDAO.getOrders({
            filters,
            page,
            ordersPerPage
        })

        let response = {
            orders: ordersList,
            page: page,
            filters: filters,
            entries_per_page: ordersPerPage,
            total_results: totalNumOrders,
        }
        res.json(response)
    }

    static async apiPostOrder (req, res, next) {
        try{
            const startDate = new Date()
            const endDate = new Date(req.body.end_date)
            const userId = req.body.user_id
            const computerId = req.body.computer_id
            //new Date()

            const orderResponse = await OrdersDAO.addOrder(
                startDate,
                endDate,
                userId,
                computerId,
            )
            res.json({status: 201})

        } catch(e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateOrder (req, res, next) {
        try {
            const orderId = req.body.order_id
            const startDate = new Date()
            const endDate = new Date(req.body.end_date)
            const userId = req.body.user_id
            const computerId = req.body.computer_id
            //new Date()

            const orderResponse = await OrdersDAO.updateOrder(
                orderId,
                startDate,
                endDate,
                userId,
                computerId,
            )

            var {error} = orderResponse
            if(error) {
                res.status(400).json({error})
            }

            res.json({status: 201})

        } catch (e) {
            res.status(500).json({error: e.mesage})
        }
    }

    static async apiDeleteOrder (req, res, next) {
        try {
            const orderId = req.body.order_id

            console.log(orderId)

            const orderResponse = await OrdersDAO.deleteOrder(
                orderId,
            )

            res.json({status: 202})

        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

}