import { Check } from "lucide-react";

interface SignupStepperProps {
  step: number;
}

const steps = [
  { number: 1, label: "Organization" },
  { number: 2, label: "Admin Info" },
  { number: 3, label: "Security" },
];

export default function SignupStepper({ step }: SignupStepperProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between relative px-2">
        {/* Background connecting line */}
        <div className="absolute top-4 left-6 right-6 h-[2px] bg-muted -z-0" />
        {/* Active progress line */}
        <div
          className="absolute top-4 left-6 h-[2px] bg-primary transition-all duration-300 -z-0"
          style={{
            width: step === 1 ? "0%" : step === 2 ? "50%" : "calc(100% - 3rem)",
          }}
        />

        {steps.map((s) => {
          const isCompleted = step > s.number;
          const isActive = step === s.number;

          return (
            <div key={s.number} className="flex flex-col items-center z-10">
              <div
                className={`
                  h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center
                  text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-105"
                        : "bg-muted text-muted-foreground border border-border"
                  }
                `}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : s.number}
              </div>

              <span
                className={`mt-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                  isActive || isCompleted ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
