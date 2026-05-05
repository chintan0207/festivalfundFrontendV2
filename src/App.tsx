import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import Dashboard from "./features/dashboard/pages/Dashboard";
import HomeLayout from "./layouts/home/HomeLayout";
import ThemePage from "./theme/ThemePage";
import AppComponentsPage from "./theme/AppComponentsPage";
import Contributions from "./features/contributions/pages/Contributions";
import Contributors from "./features/contributors/pages/Contributors";
import Expenses from "./features/expenses/pages/Expenses";
import Reports from "./features/reports/pages/Reports";
import Settings from "./features/settings/pages/Settings";
import AppPageNotFound from "./components/common/AppPageNotFound";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import ThemePalette from "./components/theme/ThemePalette";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="*" element={<AppPageNotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<HomeLayout />}>
            <Route path="" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="support" element={<Support />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="theme" element={<ThemePage />} />
            <Route path="app" element={<AppComponentsPage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contributions" element={<Contributions />} />
            <Route path="contributors" element={<Contributors />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
