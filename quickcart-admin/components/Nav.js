import {
  AdminNavIcon,
  CategoriesNavIcon,
  HeaderNavIcon,
  HomeNavIcon,
  OrdersNavIcon,
  ProductsNavIcon,
  SettingNavIcon,
} from "./icons";
import { LogoutNavIcon } from "@/components/icons/Logout";

export const Nav = ({ show }) => {
  return (
    <aside
      className={`${
        show ? "left-0" : "-left-full"
      } text-gray-500 p-4 fixed bg-bgGray h-full w-full z-10 md:static md:w-auto transition-all`}
    >
      <HeaderNavIcon />
      <div className="flex flex-col gap-2">
        <HomeNavIcon />
        <ProductsNavIcon />
        <CategoriesNavIcon />
        <OrdersNavIcon />
        <AdminNavIcon />
        <SettingNavIcon />
        <LogoutNavIcon />
      </div>
    </aside>
  );
};
