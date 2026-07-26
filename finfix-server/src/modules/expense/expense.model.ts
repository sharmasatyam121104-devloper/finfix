import { Schema, model, models } from "mongoose";
import { ITransaction, TransactionType } from "./expense.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for faster filtering & sorting
transactionSchema.index({
  userId: 1,
  transactionDate: -1,
  type: 1,
});

const TransactionModel = models.Transaction || model<ITransaction>("Transaction", transactionSchema);

export default TransactionModel;