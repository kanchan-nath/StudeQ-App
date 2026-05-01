import express from "express"
import dotenv from "dotenv"

const app = express();

const PORT = 4000
app.listen(PORT, () => {
    console.log("Hello World");

})
export { app }