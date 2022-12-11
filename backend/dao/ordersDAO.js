import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let orders

export default class OrdersDAO {

    static async injectDB(conn) {
        if (orders) {
            return
        }

        try {
            orders = await conn.db(process.env.RESTPCS_NS).collection("orders")
        } catch (e) {
            console.error(`Unable to establish collection handles in ordersDAO: ${e}`)
        }
    }

    static async getOrders({
        filters = null,
        page = 0,
        ordersPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("start_date" in filters){
                query = { "start_date": { $eq: filters["start_date"] } }
            } else if ("end_date" in filters) {
                query = {"end_date": { $eq: filters["end_date"] }}
            }
        }

        let cursor

        try {
            cursor = await orders
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return {ordersList: [], totalNumOrders: 0}
        }

        const displayCursor = cursor.limit(ordersPerPage).skip(ordersPerPage * page)

        try {
            const ordersList = await displayCursor.toArray()
            const totalNumOrders = await orders.countDocuments(query)

            return{ordersList, totalNumOrders}
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {ordersList: [], totalNumOrders: 0}
        }
    }

    static async addOrder (startDate, endDate, userId, computerId,) {
        try {
            const orderDoc = {
                start_date: startDate,
                end_date: endDate,
                user_id: ObjectId(userId),
                computer_id: ObjectId(computerId),
            }

            return await orders.insertOne(orderDoc)

        } catch (e) {
            console.error(`Unable to create order: ${e}`)
            return { error: e }
        }
    }

    static async updateOrder (orderId, startDate, endDate, userId, computerId) {

        try {
            const updateResponse = await orders.updateOne(
                {_id: ObjectId(orderId)},
                {$set: {
                    start_date: startDate,
                    end_date: endDate,
                    user_id: ObjectId(userId),
                    computer_id: ObjectId(computerId),
                }},
            )

            return updateResponse

        } catch (e) {
            console.error(`Unable to update ordar: ${e}`)
            return {error: e}
        }
    }

    static async deleteOrder (orderId) {

        try{
            const deleteResponse = await orders.deleteOne({_id: ObjectId(orderId)})

            return deleteResponse

        } catch (e) {
            console.error(`Unable to delete order: ${e}`)
            return {error: e}
        }
    }

}