import { AppButton } from "@/components/common/AppButton";
import { badgeColors, gradientColors, moduleGradientColors } from "@/theme/colors";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Flower,
  Plus,
  Settings,
  Sparkles,
  Tent,
  Trash,
  UserCheck,
  Users,
  Volume2,
  Wallet,
} from "lucide-react";
import { AppBadge } from "@/components/common/AppBadge";
import { AppCard } from "@/components/common/AppCard";

const AppComponentsPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Design System Components</h1>
        <p className="text-muted-foreground">
          Showcase of core UI components used throughout FestivalFund.
        </p>
      </div>

      <div className="p-6 border border-border/60 rounded-2xl bg-card/60 space-y-6">
        <h2 className="text-xl font-bold">App Buttons & Gradient Palette</h2>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Gradient Color Options ({gradientColors.length} Options)
          </h3>
          <div className="flex flex-wrap gap-3">
            {gradientColors.map((gradient, index) => (
              <AppButton key={index} className={`${gradient} text-white shadow-sm hover:shadow-md transition-all`}>
                Gradient {index + 1}
              </AppButton>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/40">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Module-Wise Theme Buttons
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(moduleGradientColors).map(([moduleName, bgClass]) => (
              <AppButton key={moduleName} className={bgClass}>
                {moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}
              </AppButton>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/40">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Standard Button Variants & Sizes
          </h3>
          <div className="flex flex-wrap gap-3">
            <AppButton>Primary</AppButton>
            <AppButton variant="secondary">Secondary</AppButton>
            <AppButton variant="outline">Outline</AppButton>
            <AppButton variant="ghost">Ghost</AppButton>
            <AppButton variant="destructive">Destructive</AppButton>

            <AppButton size="sm">Small</AppButton>
            <AppButton size="lg">Large</AppButton>

            <AppButton leftIcon={<Plus className="h-4 w-4" />}>Add Contributor</AppButton>
            <AppButton rightIcon={<ArrowRight className="h-4 w-4" />}>Next</AppButton>
            <AppButton variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </AppButton>
            <AppButton variant="destructive" leftIcon={<Trash className="h-4 w-4" />}>
              Delete Item
            </AppButton>

            <AppButton loading>Saving</AppButton>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-4">
        <h2 className="text-xl font-bold">App Badges</h2>

        <div className="flex flex-wrap gap-3">
          <AppBadge icon={<Users className="h-4 w-4" />} className={badgeColors.boys}>
            Boys
          </AppBadge>
          <AppBadge icon={<Users className="h-4 w-4" />} className={badgeColors.girls}>
            Girls
          </AppBadge>
          <AppBadge icon={<UserCheck className="h-4 w-4" />} className={badgeColors.parents}>
            Parents
          </AppBadge>

          <AppBadge icon={<Clock className="h-4 w-4" />} className={badgeColors.pending}>
            Pending Deposit
          </AppBadge>
          <AppBadge icon={<CheckCircle className="h-4 w-4" />} className={badgeColors.deposited}>
            Deposited
          </AppBadge>

          <AppBadge icon={<Flower className="h-4 w-4" />} className={badgeColors.decoration}>
            Decoration
          </AppBadge>
          <AppBadge icon={<Tent className="h-4 w-4" />} className={badgeColors.mandap}>
            Mandap
          </AppBadge>
          <AppBadge icon={<Volume2 className="h-4 w-4" />} className={badgeColors.sound}>
            Sound
          </AppBadge>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-6">
        <h2 className="text-xl font-bold">App Card Showcase</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AppCard
            variant="default"
            title="Festival Fund"
            subtitle="Manage contributions and expenses"
            icon={<Sparkles className="h-5 w-5" />}
          >
            <p className="text-sm text-muted-foreground">
              Track community contributions and generate festival reports.
            </p>
          </AppCard>

          <AppCard
            variant="dotted"
            title="Opening Balance"
            subtitle="Initial funds"
            icon={<Wallet className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold text-foreground">₹28,608</div>
          </AppCard>

          <AppCard
            variant="shadow"
            title="Manage Contributors"
            subtitle="Add and organize contributors"
            icon={<Users className="h-5 w-5" />}
          />

          <AppCard variant="elevated" title="Quick Actions">
            <div className="space-y-2">
              <AppButton className="w-full">Create Festival</AppButton>
              <AppButton variant="secondary" className="w-full">
                Export Summary
              </AppButton>
            </div>
          </AppCard>

          <AppCard variant="flat" title="Quick Actions">
            <div className="space-y-2">
              <AppButton className="w-full">Create Festival</AppButton>
              <AppButton variant="secondary" className="w-full">
                Export Summary
              </AppButton>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default AppComponentsPage;
