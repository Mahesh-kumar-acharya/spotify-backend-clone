require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/database/db')

     
async function startServer() {
    try{
        if (!process.env.MONGO_URL || !process.env.JWT_SECRET) {
            throw new Error("MONGO_URL and JWT_SECRET must be set in the environment.")
        }

        await connectDB()
        app.listen(3000, ()=> {
            console.log("The server is running on port 3000. ... ");
        })
    }catch(err){
        console.error("Error connecting to the database: ", err)
        process.exit(1)
    }
}

startServer()

