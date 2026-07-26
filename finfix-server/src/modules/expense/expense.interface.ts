import { Document, Types } from "mongoose";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface ITransaction extends Document {
  userId: Types.ObjectId;

  type: TransactionType;

  description: string;

  amount: number;

  category: string;

  transactionDate: Date;

  createdAt: Date;

  updatedAt: Date;
}
