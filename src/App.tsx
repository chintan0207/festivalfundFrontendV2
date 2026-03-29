import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/home/pages/Home";
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
import Features from "./features/features/pages/Features";
import Pricing from "./features/pricing/pages/Pricing";
import About from "./features/about/pages/About";
import Contact from "./features/contact/pages/Contact";
import Support from "./features/support/pages/Support";
import PrivacyPolicy from "./features/privacy-policy/pages/PrivacyPolicy";
import TermsOfService from "./features/terms-of-service/pages/TermsOfService";
import CookiePolicy from "./features/cookie-policy/pages/CookiePolicy";
// import ThemePalette from "./components/theme/ThemePalette";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="*" element={<AppPageNotFound />} />

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
