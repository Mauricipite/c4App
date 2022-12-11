import UsersDAO from "../dao/usersDAO.js"

export default class usersCtrl {

    static async apiGetUsers (req, res, next) {

        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.user_name) {
            filters.user_name = req.query.user_name
        } else if (req.query.direccion) {
            filters.direccion = req.query.direccion
        }

        const {usersList, totalNumUsers} = await UsersDAO.getUsers({
            filters,
            page,
            usersPerPage
        })

        let response = {
            users: usersList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results: totalNumUsers,
        }
        res.json(response)
    }

    static async apiPostUser (req, res, next) {
        try{
            const userName = req.body.user_name
            const uAddress = req.body.direccion
            const userPhone = req.body.user_phone
            const userEmail = req.body.user_email

            const userResponse = await UsersDAO.addUser(
                userName,
                uAddress,
                userPhone,
                userEmail,
            )
            res.json({status: 201})

        } catch(e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateUser (req, res, next) {
        try {
            const userId = req.body.user_id
            const userName = req.body.user_name
            const uAddress = req.body.direccion
            const userPhone = req.body.user_phone
            const userEmail = req.body.user_email

            const userResponse = await UsersDAO.updateUser(
                userId,
                userName,
                uAddress,
                userPhone,
                userEmail,
            )

            var {error} = userResponse
            if(error) {
                res.status(400).json({error})
            }

            res.json({status: 201})

        } catch (e) {
            res.status(500).json({error: e.mesage})
        }
    }

    static async apiDeleteUser (req, res, next) {
        try {
            const userId = req.body.user_id
            //const userName = req.body.user_name

            console.log(userId)

            const userResponse = await UsersDAO.deleteUser(
                userId,
            )

            res.json({status: 202})

        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

}