import { AppButton } from "./AppButton";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const AppPageNotFound = () => {
  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>

        <p className="mt-2 max-w-md text-muted-foreground">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6">
          <AppButton leftIcon={<Home />} >
            <Link to="/">
              Back to Home
            </Link>
          </AppButton>
        </div>
      </div>
    </>
  );
};

export default AppPageNotFound;
