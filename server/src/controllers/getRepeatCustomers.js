import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getRepeatCustomers = async (req, res) => {
  const { interval } = req.params;

  let groupStage; // This will hold the grouping logic based on the interval
  let projectStage; // This will specify the fields we want in the final result

  try {
    await client.connect();
    const database = client.db("RQ_Analytics");
    const collection = database.collection("shopifyOrders");

    // Ensure the `created_at` field is converted to Date if it's not already
    const addFieldsStage = {
      $addFields: {
        created_at: { $toDate: "$created_at" },
      },
    };

    // Create grouping and projection stages based on the interval type
    switch (interval) {
      case "daily":
        groupStage = {
          $group: {
            _id: {
              email: "$email",
              day: {
                $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
              },
            },
            count: { $sum: 1 }, // Count number of purchases per day for each email
          },
        };
        projectStage = {
          $project: {
            _id: 0,
            email: "$_id.email",
            timeFrame: "$_id.day",
            count: 1,
          },
        };
        break;

      case "monthly":
        groupStage = {
          $group: {
            _id: {
              email: "$email",
              month: {
                $dateToString: { format: "%Y-%m", date: "$created_at" },
              },
            },
            count: { $sum: 1 },
          },
        };
        projectStage = {
          $project: {
            _id: 0,
            email: "$_id.email",
            timeFrame: "$_id.month",
            count: 1,
          },
        };
        break;

      case "quarterly":
        groupStage = {
          $group: {
            _id: {
              email: "$email",
              year: { $year: "$created_at" },
              quarter: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } },
            },
            count: { $sum: 1 },
          },
        };
        projectStage = {
          $project: {
            _id: 0,
            email: "$_id.email",
            timeFrame: {
              $concat: [
                { $toString: "$_id.year" },
                "-Q",
                { $toString: "$_id.quarter" },
              ],
            },
            count: 1,
          },
        };
        break;

      case "yearly":
        groupStage = {
          $group: {
            _id: {
              email: "$email",
              year: { $year: "$created_at" },
            },
            count: { $sum: 1 },
          },
        };
        projectStage = {
          $project: {
            _id: 0,
            email: "$_id.email",
            timeFrame: "$_id.year",
            count: 1,
          },
        };
        break;

      default:
        res.status(400).json({ message: "Invalid interval" });
        return;
    }

    // Filter for customers who made more than one purchase
    const repeatCustomerStage = {
      $match: { count: { $gt: 1 } }, // Only customers with more than 1 purchase
    };

    // Build the final aggregation pipeline
    const pipeline = [
      addFieldsStage,
      groupStage, 
      repeatCustomerStage, 
      projectStage, 
      { $sort: { count: -1 } },
      { $limit: 2000 }, // Limit the number of results to 2000
    ];

    // Execute the pipeline and fetch results
    const repeatCustomerData = await collection.aggregate(pipeline).toArray();

    // Send the results back to the client
    res.json(repeatCustomerData);
  } catch (err) {
    console.error("Error during MongoDB operation:", err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    await client.close();
  }
};
