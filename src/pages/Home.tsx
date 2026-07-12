import { useCurrentUser } from "@/api/hooks/useAuth";
import HeroSection from "./components/HeroSection";

const Home = () => {
  useCurrentUser();
  
  return (
    <div className="py-10">
      <HeroSection />
    </div>
  );
};

export default Home;
