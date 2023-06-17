import mongoose from "mongoose";

export default function mongooseConnect() {
  return mongoose.connection.readyState === 1
    ? mongoose.connection.asPromise()
    : mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
}
