import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import { createExpense, deleteExpense, getExpense, getExpenseById, updateExpense, getExpenseStats, getAnalytics, getCategoryAnalytics } from "./expense.controller";

const ExpenseRouter = Router();

ExpenseRouter.use(authMiddleware);

ExpenseRouter.post("/", createExpense);
ExpenseRouter.get("/", getExpense);
ExpenseRouter.get("/stats", getExpenseStats);
ExpenseRouter.get("/analytics", getAnalytics);
ExpenseRouter.get("/category-analytics", getCategoryAnalytics);
ExpenseRouter.get("/:id", getExpenseById);
ExpenseRouter.patch("/:id", updateExpense);
ExpenseRouter.delete("/:id", deleteExpense);


export default ExpenseRouter;