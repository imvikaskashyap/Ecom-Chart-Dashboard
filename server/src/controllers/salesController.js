import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getSalesData = async (req, res) => {
  const { interval } = req.params;

  let groupStage;

  try {
    await client.connect();
    const database = client.db("RQ_Analytics");
    const collection = database.collection("shopifyOrders");

    // Modified pipeline to convert `created_at` field to a date type, if not already
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

    const pipeline = [
      addFieldsStage, 
      groupStage,
      { $sort: { _id: 1 } },
      { $limit: 2000 },
    ];

    const salesData = await collection.aggregate(pipeline).toArray();

    res.json(salesData);
  } catch (err) {
    console.error("Error during MongoDB operation:", err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    await client.close();
  }
};
