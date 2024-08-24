import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getCustomerDistributionByCity = async (req, res) => {
  try {
    await client.connect();
    const database = client.db("RQ_Analytics");
    const customersCollection = database.collection("shopifyCustomers");

    // Aggregation pipeline to group customers by city
    const pipeline = [
      {
        $match: {
          "default_address.city": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$default_address.city",
          customerCount: { $sum: 1 },
        },
      },
      {
        $project: {
          city: "$_id",
          customerCount: 1,
          _id: 0,
        },
      },
      { $sort: { customerCount: -1 } },
    ];

    const cityDistributionData = await customersCollection
      .aggregate(pipeline)
      .toArray();

    res.json(cityDistributionData);
  } catch (err) {
    console.error("Error during MongoDB operation:", err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    await client.close();
  }
};
