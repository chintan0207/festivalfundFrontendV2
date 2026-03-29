import { AppButton } from "@/components/common/AppButton";
import { Plus } from "lucide-react";

const FloatingActionButton = () => {
  return (
    <AppButton
      size="icon"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-12 w-12 rounded-full shadow-lg md:hidden"
    >
      <Plus className="h-5 w-5" />
    </AppButton>
  );
};

export default FloatingActionButton;
