import app from "./server.js";
import mongodb from "mongodb"
import dotenv from "dotenv"
import UsersDAO from "./dao/usersDAO.js";
import ComputersDAO from "./dao/computersDAO.js";
import OrdersDAO from "./dao/ordersDAO.js";

dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTPCS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
.catch(err => {
    console.log(err.stack);
    process.exit(1)
})
.then(async client => {
    await UsersDAO.injectDB(client)
    await ComputersDAO.injectDB(client)
    await OrdersDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})