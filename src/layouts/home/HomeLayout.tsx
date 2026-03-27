import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomeLayout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
      <main className="flex-1 overflow-auto p-4 md:p-8 py-10 md:py-16 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
