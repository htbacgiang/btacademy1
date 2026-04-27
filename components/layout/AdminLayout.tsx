import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineContainer,
  AiOutlineTeam,
  AiOutlineMail,
  AiOutlineContacts,
  AiOutlineFileAdd,
} from "react-icons/ai";
import { IoIdCardSharp } from "react-icons/io5";
import AppHead from "../common/AppHead";
import AdminSecondaryNav from "../common/nav/AdminSecondaryNav";
import Slidebar from '../backend/Slidebar';
import Navbar from '../backend/Navbar';
interface Props {
  children: ReactNode;
  title?: string;
}


const AdminLayout: FC<Props> = ({ title, children }): JSX.Element => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <AppHead title={title} />
      <div className="flex">
        <Slidebar 
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main content: ml-60 khi mở rộng, ml-16 khi thu gọn */}
        <div
          className={`
            ml-0 flex-grow bg-slate-100 min-h-screen
            transition-all duration-300
            ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}
          `}
        >
          <main className="bg-white dark:bg-slate-900 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
