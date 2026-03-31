import connectDB from "./config/database.js"
import app from "./app.js"

const startServer = async () => {
  try {
    console.log("Server started")
    await connectDB()
    app.on("error", (error) => {
      console.log("Error in server: ", error)
      throw error
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server started on port: ", process.env.PORT)
    })
  } catch (error) {
    console.log("Error in server: ", error)
  }
}

startServer()
