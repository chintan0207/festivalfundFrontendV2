import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomeLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
