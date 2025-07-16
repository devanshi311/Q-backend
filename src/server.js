import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsROute from "./routes/transactionsRoute.js"

dotenv.config();

const app = express();

//middleware
app.use(rateLimiter);
app.use(express.json());

// app.use((req, res, next) => {
//     console.log("hey we hit request,the method is:", req.method, "and the URL is:", req.url);
//     next();
// })

const PORT = process.env.PORT || 5001

app.use("/api/transactions",transactionsROute);

initDB().then(()=>{
    app.listen(PORT, () =>{
        console.log("Server is running on PORT:",PORT);
    });
});