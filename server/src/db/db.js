import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}`
    );
    // console.log(connectionInstance)
  } catch (error) {
    console.log(`MongoDb connection has this ERR : ${error}`);
    process.exit(1);
  }
};

export default dbConnect;
