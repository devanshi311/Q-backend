import express from "express"

import { getTransactionsByUserId, 
         createTransactions,
         deleteTransactions,
        getSummaryByUserId} from "../controllers/transactionsController.js"

const router = express.Router();


router.post("/", createTransactions)

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransactions)

router.get("/summary/:userId", getSummaryByUserId);

export default router;