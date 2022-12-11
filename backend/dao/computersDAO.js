import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let computers

export default class ComputersDAO {

    static async injectDB(conn) {
        if (computers) {
            return
        }

        try {
            computers = await conn.db(process.env.RESTPCS_NS).collection("computers")
        } catch (e) {
            console.error(`Unable to establish collection handles in computersDAO: ${e}`)
        }
    }

    static async getComputers({
        filters = null,
        page = 0,
        computersPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("description" in filters){
                query = { $text: { $search: filters["description"] } }
            } else if ("category" in filters) {
                query = {$text: { $search: filters["category"] }}
            }
        }

        let cursor

        try {
            cursor = await computers
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return {computersList: [], totalNumComputers: 0}
        }

        const displayCursor = cursor.limit(computersPerPage).skip(computersPerPage * page)

        try {
            const computersList = await displayCursor.toArray()
            const totalNumComputers = await computers.countDocuments(query)

            return{computersList, totalNumComputers}
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {computersList: [], totalNumComputers: 0}
        }
    }

    static async addComputer (description, category) {
        try {
            const computerDoc = {
                description: description,
                category: category,
            }

            return await computers.insertOne(computerDoc)

        } catch (e) {
            console.error(`Unable to create computer: ${e}`)
            return { error: e }
        }
    }

    static async updateComputer (computerId, description, category) {

        try {
            const updateResponse = await computers.updateOne(
                {_id: ObjectId(computerId)},
                {$set: {
                    description: description,
                    category: category
                }},
            )

            return updateResponse

        } catch (e) {
            console.error(`Unable to update computer: ${e}`)
            return {error: e}
        }
    }

    static async deleteComputer (computerId) {

        try{
            const deleteResponse = await computers.deleteOne({_id: ObjectId(computerId)})

            return deleteResponse

        } catch (e) {
            console.error(`Unable to delete computer: ${e}`)
            return {error: e}
        }
    }

}