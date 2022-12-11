import ComputersDAO from "../dao/computersDAO.js"

export default class computersCtrl {

    static async apiGetComputers (req, res, next) {

        const computersPerPage = req.query.computersPerPage ? parseInt(req.query.computersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.description) {
            filters.description = req.query.description
        } else if (req.query.category) {
            filters.category = req.query.category
        }

        const {computersList, totalNumComputers} = await ComputersDAO.getComputers({
            filters,
            page,
            computersPerPage
        })

        let response = {
            computers: computersList,
            page: page,
            filters: filters,
            entries_per_page: computersPerPage,
            total_results: totalNumComputers,
        }
        res.json(response)
    }

    static async apiPostComputer (req, res, next) {
        try{
            const description = req.body.description
            const category = req.body.category

            const computerResponse = await ComputersDAO.addComputer(
                description,
                category,
            )
            res.json({status: 201})

        } catch(e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateComputer (req, res, next) {
        try {
            const computerId = req.body.computer_id
            const description = req.body.description
            const category = req.body.category

            const computerResponse = await ComputersDAO.updateComputer(
                computerId,
                description,
                category,
            )

            var {error} = computerResponse
            if(error) {
                res.status(400).json({error})
            }

            res.json({status: 201})

        } catch (e) {
            res.status(500).json({error: e.mesage})
        }
    }

    static async apiDeleteComputer (req, res, next) {
        try {
            const computerId = req.body.computer_id

            console.log(computerId)

            const computerResponse = await ComputersDAO.deleteComputer(
                computerId,
            )

            res.json({status: 202})

        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

}