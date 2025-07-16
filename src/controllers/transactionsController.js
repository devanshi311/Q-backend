import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req,res) {
   try {
            const { userId } = req.params
            const transactions = await sql`
                SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
            `;
            // console.log("Transactions fetched:", transactions);
            res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({message: "Internal server error"});
        }
    
}

export async function createTransactions(req ,res)  {
    try {
        const {title,amount,category, user_id} = req.body;
        
        if(!title || !category || !user_id || amount === undefined){
            return res.status(400).json({message:"All fields are required."});
        }
        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;
        console.log("Transaction created:", transaction);
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({message: "Internal server error"});        
    }
}

export async function deleteTransactions (req, res)  {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({message: "Invalid transaction ID"});
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
        
        if (result.length === 0) {
            return res.status(404).json({message: "Transaction not found."});
        }
        
        console.log("Transaction deleted:", result[0]);
        res.status(200).json({message: "Transaction deleted successfully", transaction: result[0]});
    }
    catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function getSummaryByUserId (req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;
        
        
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        }); 
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({message: "Internal server error"});
    }
}