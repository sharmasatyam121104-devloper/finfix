import { Request, Response } from "express";
import TransactionModel from "./expense.model";
import { SessionInterface } from "../user/user.interface";
import mongoose from "mongoose";
import moment from "moment";

export const createExpense = async (req: SessionInterface,res: Response) => {
    try {
        const userId = req.user?.id;

        const { type, description, amount, category, transactionDate } = req.body;

        const transaction = await TransactionModel.create({
            userId,
            type,
            description,
            amount,
            category,
            transactionDate,
        });

        return res.status(201).json({
            message: "Transaction created successfully.",
            transaction,
        });
    } 
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: `Error in createTransaction controller: ${error.message}`,
            });
        }
    }
};



export const getExpense = async (req: SessionInterface, res: Response) => {
    try {
        const userId = req.user?.id;

        const {
            page = 1,
            limit = 10,
            type,
            minAmount,
            maxAmount,
            startDate,
            endDate,
            sortBy = "updatedAt",
            sortOrder = "desc",
        } = req.query;

        const query: any = { userId };

        if (type) {
            query.type = type;
        }

        if (minAmount || maxAmount) {
            query.amount = {};

            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }

        if (startDate || endDate) {
            query.transactionDate = {};

            if (startDate)
            query.transactionDate.$gte = new Date(startDate as string);

            if (endDate)
            query.transactionDate.$lte = new Date(endDate as string);
        }

        const transactions = await TransactionModel.find(query)
            .sort({
            [sortBy as string]: sortOrder === "asc" ? 1 : -1,
            })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await TransactionModel.countDocuments(query);

        return res.status(200).json({
            transactions,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        if (error instanceof Error) {
                return res.status(500).json({
                message: `Error in getTransactions controller: ${error.message}`,
            });
        }
    }
};


export const getExpenseById = async (req: SessionInterface, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
            message: "Invalid transaction id.",
            });
        }

        const transaction = await TransactionModel.findOne({
            _id: id,
            userId,
        });

        if (!transaction) {
            return res.status(404).json({
            message: "Transaction not found.",
            });
        }

        return res.status(200).json(transaction);
    } 
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: `Error in getTransactionById controller: ${error.message}`,
            });
        }
    }
};


export const updateExpense = async (req: SessionInterface, res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
            message: "Invalid transaction id.",
            });
        }

        const transaction = await TransactionModel.findOneAndUpdate(
            {
            _id: id,
            userId,
            },
            req.body,
            {
            new: true,
            runValidators: true,
            }
        );

        if (!transaction) {
            return res.status(404).json({
            message: "Transaction not found.",
            });
        }

        return res.status(200).json({
            message: "Transaction updated successfully.",
            transaction,
        });
    } 
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: `Error in updateTransaction controller: ${error.message}`,
            });
        }
    }
};


export const deleteExpense = async (req: SessionInterface,res: Response) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
            message: "Invalid transaction id.",
            });
        }

        const transaction = await TransactionModel.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!transaction) {
            return res.status(404).json({
            message: "Transaction not found.",
            });
        }

        return res.status(200).json({
            message: "Transaction deleted successfully.",
        });
    } 
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                message: `Error in deleteTransaction controller: ${error.message}`,
            });
        }
    }
};


export const getExpenseStats = async (req: SessionInterface, res: Response) => {
    try {
        const userId = req.user?.id;

        const stats = await TransactionModel.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $group: {
              _id: "$type",
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);


        let totalIncome = 0;
        let totalExpense = 0;

        stats.forEach((item: any) => {
            if (item._id === "income") {
            totalIncome = item.total;
            }

            if (item._id === "expense") {
            totalExpense = item.total;
            }
        });

        return res.status(200).json({
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
        });
    } 
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
            message: `Error in getExpenseStats controller: ${error.message}`,
            });
        }
    }
};

export const getAnalytics = async (
  req: SessionInterface,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      range = "7d",
      startDate,
      endDate,
    } = req.query;

    let from: moment.Moment;
    let to: moment.Moment;
    let format = "%Y-%m-%d";
    switch (range) {
      case "today":
        from = moment().startOf("day");
        to = moment().endOf("day");
        format = "%H:00";
        break;

      case "7d":
        from = moment().subtract(6, "days").startOf("day");
        to = moment().endOf("day");
        format = "%Y-%m-%d";
        break;

      case "30d":
        from = moment().subtract(29, "days").startOf("day");
        to = moment().endOf("day");
        format = "%Y-%m-%d";
        break;

      case "6m":
        from = moment().subtract(5, "months").startOf("month");
        to = moment().endOf("month");
        format = "%Y-%m";
        break;

      case "1y":
        from = moment().subtract(11, "months").startOf("month");
        to = moment().endOf("month");
        format = "%Y-%m";
        break;

      case "custom":
        if (!startDate || !endDate) {
          return res.status(400).json({
            message: "startDate and endDate are required",
          });
        }

        from = moment(startDate as string).startOf("day");
        to = moment(endDate as string).endOf("day");
        format = "%Y-%m-%d";
        break;

      default:
        from = moment().subtract(6, "days").startOf("day");
        to = moment().endOf("day");
        format = "%Y-%m-%d";
    }

    const analytics = await TransactionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          transactionDate: {
            $gte: from.toDate(),
            $lte: to.toDate(),
          },
        },
      },

      {
        $group: {
          _id: {
            label: {
              $dateToString: {
                format,
                date: "$transactionDate",
              },
            },
            type: "$type",
          },

          total: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          "_id.label": 1,
        },
      },
    ]);

    const graph: Record<
      string,
      {
        label: string;
        income: number;
        expense: number;
      }
    > = {};

    analytics.forEach((item: any) => {
      const label = item._id.label;

      if (!graph[label]) {
        graph[label] = {
          label,
          income: 0,
          expense: 0,
        };
      }

      if (item._id.type === "income") {
        graph[label].income = item.total;
      } else {
        graph[label].expense = item.total;
      }
    });

    const graphData = Object.values(graph);

    const totalIncome = graphData.reduce(
      (sum, item) => sum + item.income,
      0
    );

    const totalExpense = graphData.reduce(
      (sum, item) => sum + item.expense,
      0
    );

    return res.status(200).json({
      success: true,

      range,

      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },

      graph: graphData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getCategoryAnalytics = async (
  req: SessionInterface,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const categories = await TransactionModel.aggregate([
    {
        $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "expense",
        },
    },
    {
        $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        transactions: { $sum: 1 },
        },
    },
    {
        $project: {
        _id: 0,
        category: "$_id",
        total: 1,
        transactions: 1,
        },
    },
    {
        $sort: {
        total: -1,
        },
    },
    ]);

    const totalExpense = categories.reduce(
      (sum, item) => sum + item.total,
      0
    );

    return res.status(200).json({
      success: true,
      totalExpense,
      data: categories,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};