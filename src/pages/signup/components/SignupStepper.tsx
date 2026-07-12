import { Check } from "lucide-react";

interface SignupStepperProps {
  step: number;
}

export default function SignupStepper({ step }: SignupStepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`
              h-10 w-10 rounded-full flex items-center justify-center
              text-sm font-semibold transition
              ${step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}
            `}
          >
            {step > s ? <Check className="h-4 w-4" /> : s}
          </div>

          {i !== 2 && (
            <div className={`w-10 h-[2px] ${step > s ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
