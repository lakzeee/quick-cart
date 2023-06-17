import { useSession, signIn, signOut } from "next-auth/react";
import { Nav } from "@/components/Nav";
import {menuIcon} from "@/components/icons";
import {useState} from "react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  if (!session) {
    return (
      <div className={"bg-bgGray h-screen w-screen flex items-center"}>
        <div className={"text-center w-full"}>
          <button
            onClick={() => signIn("google")}
            className={"bg-white p-2 px-4 rounded-lg"}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  return (
      <div className={"bg-bgGray min-h-screen"}>
          <button className={'md:hidden m-2'} onClick={()=>setIsNavbarOpen(true)}>{menuIcon}</button>
          <div className={"flex"}>
              <Nav show={isNavbarOpen}/>
              <div className="bg-white h-screen flex-grow mt-2 mr-2 rounded-lg p-4">
                  {children}
              </div>
          </div>
      </div>
  );
}
