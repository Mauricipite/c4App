import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let users

export default class UsersDAO {

    static async injectDB(conn) {
        if (users) {
            return
        }

        try {
            users = await conn.db(process.env.RESTPCS_NS).collection("users")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    static async getUsers({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("user_name" in filters){
                query = { $text: { $search: filters["user_name"] } }
            } else if ("direccion" in filters) {
                query = {$text: { $search: filters["direccion"] }}
            }
        }

        let cursor

        try {
            cursor = await users
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return {usersList: [], totalNumUsers: 0}
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try {
            const usersList = await displayCursor.toArray()
            const totalNumUsers = await users.countDocuments(query)

            return{usersList, totalNumUsers}
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {usersList: [], totalNumUsers: 0}
        }
    }

    static async addUser (userName, uAddress, userPhone, userEmail) {
        try {
            const userDoc = {
                user_name: userName,
                direccion: uAddress,
                user_phone: userPhone,
                user_email: userEmail,
            }

            return await users.insertOne(userDoc)

        } catch (e) {
            console.error(`Unable to create user: ${e}`)
            return { error: e }
        }
    }

    static async updateUser (userId, userName, uAddress,userPhone, userEmail) {

        try {
            const updateResponse = await users.updateOne(
                {_id: ObjectId(userId)},
                {$set: {
                    user_name: userName,
                    direccion: uAddress,
                    user_phone: userPhone,
                    user_email: userEmail
                }},
            )

            return updateResponse

        } catch (e) {
            console.error(`Unable to update user: ${e}`)
            return {error: e}
        }
    }

    static async deleteUser (userId) {

        try{
            const deleteResponse = await users.deleteOne({_id: ObjectId(userId)})

            return deleteResponse

        } catch (e) {
            console.error(`Unable to delete user: ${e}`)
            return {error: e}
        }
    }
}