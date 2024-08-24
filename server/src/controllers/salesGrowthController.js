import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getSalesGrowthRate = async (req, res) => {
  const { interval } = req.params;

  let groupStage;

  try {
    await client.connect();
    const database = client.db("RQ_Analytics");
    const collection = database.collection("shopifyOrders");

    const addFieldsStage = {
      $addFields: {
        created_at: {
          $convert: {
            input: "$created_at",
            to: "date",
            onError: null,
            onNull: null,
          },
        },
      },
    };

    // Define grouping stages based on interval
    switch (interval) {
      case "daily":
        groupStage = {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            totalSales: { $sum: { $toDouble: "$total_price" } },
          },
        };
        break;
      case "monthly":
        groupStage = {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
            totalSales: { $sum: { $toDouble: "$total_price" } },
          },
        };
        break;
      case "quarterly":
        groupStage = {
          $group: {
            _id: {
              $concat: [
                { $toString: { $year: "$created_at" } },
                "-Q",
                {
                  $toString: {
                    $ceil: { $divide: [{ $month: "$created_at" }, 3] },
                  },
                },
              ],
            },
            totalSales: { $sum: { $toDouble: "$total_price" } },
          },
        };
        break;
      case "yearly":
        groupStage = {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$created_at" } },
            totalSales: { $sum: { $toDouble: "$total_price" } },
          },
        };
        break;
      default:
        res.status(400).json({ message: "Invalid interval" });
        return;
    }

    // Define the pipeline for aggregation
    const pipeline = [
      addFieldsStage,
      groupStage,
      { $sort: { _id: 1 } },
      {
        $setWindowFields: {
          partitionBy: null,
          sortBy: { _id: 1 },
          output: {
            previousTotalSales: {
              $shift: {
                output: "$totalSales",
                by: -1,
              },
            },
          },
        },
      },
      {
        $addFields: {
          growthRate: {
            $cond: [
              { $eq: ["$previousTotalSales", null] },
              null,
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$totalSales", "$previousTotalSales"] },
                      "$previousTotalSales",
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          period: "$_id",
          totalSales: 1,
          previousTotalSales: 1,
          growthRate: 1,
        },
      },
    ];

    const salesGrowthData = await collection.aggregate(pipeline).toArray();

    res.json(salesGrowthData);
  } catch (err) {
    console.error("Error during MongoDB operation:", err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    await client.close();
  }
};
