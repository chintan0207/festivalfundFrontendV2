import { AppButton } from "@/components/common/AppButton";
import { badgeColors, gradientColors } from "@/theme/colors";
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
    <>
      <div className="p-6 border rounded-xl space-y-6">
        <h2 className="text-xl font-semibold">App Buttons</h2>

        <div className="flex flex-wrap gap-4">
          {/* Gradient Buttons */}

          <AppButton className={gradientColors[0]}>Dashboard</AppButton>

          <AppButton className={gradientColors[1]}>Contributions</AppButton>

          <AppButton className={gradientColors[2]}>Reports</AppButton>

          <AppButton className={gradientColors[3]}>Settings</AppButton>

          <AppButton className={gradientColors[4]}>Export</AppButton>

          <AppButton className={gradientColors[5]}>Delete</AppButton>

          {/* Variants */}

          <AppButton>Primary</AppButton>

          <AppButton variant="secondary">Secondary</AppButton>

          <AppButton variant="outline">Outline</AppButton>

          <AppButton variant="ghost">Ghost</AppButton>

          <AppButton variant="destructive">Destructive</AppButton>

          {/* Sizes */}

          <AppButton size="sm">Small</AppButton>

          <AppButton size="lg">Large</AppButton>

          {/* Icons */}

          <AppButton leftIcon={<Plus className="h-4 w-4" />}>Add Contributor</AppButton>

          <AppButton rightIcon={<ArrowRight className="h-4 w-4" />}>Next</AppButton>

          <AppButton variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </AppButton>

          <AppButton variant="destructive" leftIcon={<Trash className="h-4 w-4" />}>
            Delete Item
          </AppButton>

          {/* Loading */}

          <AppButton loading>Saving</AppButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold">App Badges</h2>

        {/* Categories */}

        <AppBadge icon={<Users className="h-4 w-4" />} className={badgeColors.boys}>
          Boys
        </AppBadge>

        <AppBadge icon={<Users className="h-4 w-4" />} className={badgeColors.girls}>
          Girls
        </AppBadge>

        <AppBadge
          icon={<UserCheck className="h-4 w-4" />}
          className={badgeColors.parents}
        >
          Parents
        </AppBadge>

        {/* Contribution Status */}

        <AppBadge icon={<Clock className="h-4 w-4" />} className={badgeColors.pending}>
          Pending Deposit
        </AppBadge>

        <AppBadge
          icon={<CheckCircle className="h-4 w-4" />}
          className={badgeColors.deposited}
        >
          Deposited
        </AppBadge>

        {/* Expense Categories */}

        <AppBadge
          icon={<Flower className="h-4 w-4" />}
          className={badgeColors.decoration}
        >
          Decoration
        </AppBadge>

        <AppBadge icon={<Tent className="h-4 w-4" />} className={badgeColors.mandap}>
          Mandap
        </AppBadge>

        <AppBadge icon={<Volume2 className="h-4 w-4" />} className={badgeColors.sound}>
          Sound
        </AppBadge>
      </div>
      <div className="p-6 rounded-xl border space-y-6">
        <h2 className="text-2xl font-bold">App Cards</h2>

        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-bold">App Card Showcase</h2>

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
              <div className="text-3xl font-bold">₹28,608</div>
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
    </>
  );
};

export default AppComponentsPage;
