import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getNewCustomersData = async (req, res) => {
  const { interval } = req.params;

  let groupStage;

  try {
    await client.connect();
    const database = client.db("RQ_Analytics");
    const collection = database.collection("shopifyCustomers");

    // Determine the grouping stage based on the interval
    switch (interval) {
      case "daily":
        groupStage = {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$created_at" },
              },
            },
            newCustomers: { $sum: 1 },
          },
        };
        break;
      case "monthly":
        groupStage = {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: { $toDate: "$created_at" },
              },
            },
            newCustomers: { $sum: 1 },
          },
        };
        break;
      case "quarterly":
        groupStage = {
          $group: {
            _id: {
              $concat: [
                { $toString: { $year: { $toDate: "$created_at" } } },
                "-Q",
                {
                  $toString: {
                    $ceil: {
                      $divide: [{ $month: { $toDate: "$created_at" } }, 3],
                    },
                  },
                },
              ],
            },
            newCustomers: { $sum: 1 },
          },
        };
        break;
      case "yearly":
        groupStage = {
          $group: {
            _id: {
              $dateToString: { format: "%Y", date: { $toDate: "$created_at" } },
            },
            newCustomers: { $sum: 1 },
          },
        };
        break;
      default:
        res.status(400).json({ message: "Invalid interval" });
        return;
    }

    const pipeline = [groupStage, { $sort: { _id: 1 } }, { $limit: 2000 }];

    const customersData = await collection.aggregate(pipeline).toArray();

    res.json(customersData);
  } catch (err) {
    console.error("Error during MongoDB operation:", err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    await client.close();
  }
};
