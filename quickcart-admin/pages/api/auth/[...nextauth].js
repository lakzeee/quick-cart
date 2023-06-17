import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import mongooseConnect from "@/lib/mongoose";

async function isAdminEmail(email) {
  await mongooseConnect();
  return !!(await Admin.findOne({ email }));
}

const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session }) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};
export default NextAuth(authOption);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(res, req, authOption);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
