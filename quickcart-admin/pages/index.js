import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { Avatar, Chip } from "@mui/material";
import Stats from "@/components/Stats";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  if (!session) return <Layout></Layout>;
  return (
    <Layout>
      <div className={"flex justify-center"}>
        <div className={"max-w-lg"}>
          <div className={"mb-4"}>
            <Chip
              avatar={<Avatar alt="Natacha" src={session.user.image} />}
              label={session.user.email}
              variant="outlined"
            ></Chip>
          </div>
          <Stats></Stats>
        </div>
      </div>
    </Layout>
  );
}
