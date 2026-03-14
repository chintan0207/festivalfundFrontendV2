import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/home/pages/Home";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import Dashboard from "./features/dashboard/pages/Dashboard";
import HomeLayout from "./layouts/home/HomeLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<HomeLayout />}>
            <Route path="" element={<Home />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="contributions" element={<Contributions />} /> */}
            {/* <Route path="contributors" element={<Contributors />} /> */}
            {/* <Route path="expenses" element={<Expenses />} /> */}
            {/* <Route path="reports" element={<Reports />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
