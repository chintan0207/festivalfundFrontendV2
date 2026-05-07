import { useAuthStore } from "@/api/auth/auth.store";
import HeroSection from "./components/HeroSection";
import { useEffect } from "react";

const Home = () => {
  const { getMe } = useAuthStore();

  useEffect(() => {
    getMe();
  }, [getMe]);
  
  return (
    <div className="py-10">
      <HeroSection />
    </div>
  );
};

export default Home;
