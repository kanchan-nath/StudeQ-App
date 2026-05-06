import { app } from "./app.js"
import { connectDB } from "./lib/mongoClient.js"

const PORT = process.env.PORT

connectDB()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);

    })
})
.catch((error)=>{
    console.log("MONGO db connection failed !!! ", error);
})