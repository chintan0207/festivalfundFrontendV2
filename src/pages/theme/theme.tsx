import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradientColors, moduleGradientColors } from "@/theme/colors";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ColorBlock = ({
  name,
  className,
  recommended,
}: {
  name: string;
  className: string;
  recommended?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    <div className={`h-16 w-full rounded-md border ${className}`} />
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{name}</span>
      {recommended && (
        <Badge variant="secondary" className="text-xs">
          Recommended
        </Badge>
      )}
    </div>
    <span className="text-xs text-muted-foreground">{className}</span>
  </div>
);

const ThemePage = () => {
  return (
    <div className="p-10 space-y-10">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Theme Test Page</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Palette & Usage</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-8">
          {/* Core Colors */}
          <section>
            <h3 className="mb-3 font-semibold">Core Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorBlock name="Background" className="bg-background" recommended />
              <ColorBlock name="Foreground" className="bg-foreground" recommended />
              <ColorBlock name="Primary" className="bg-primary" recommended />
              <ColorBlock name="Secondary" className="bg-secondary" />
              <ColorBlock name="Accent" className="bg-accent" />
              <ColorBlock name="Muted" className="bg-muted" />
              <ColorBlock name="Destructive" className="bg-destructive" />
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h3 className="mb-3 font-semibold">Buttons (Recommended Usage)</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </section>
          <section>
            <h3 className="mb-3 font-semibold">Module-Wise Theme Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button className={moduleGradientColors.dashboard}>Dashboard</Button>
              <Button className={moduleGradientColors.festivals}>Festivals</Button>
              <Button className={moduleGradientColors.contributors}>Contributors</Button>
              <Button className={moduleGradientColors.contributions}>Contributions</Button>
              <Button className={moduleGradientColors.expenses}>Expenses</Button>
              <Button className={moduleGradientColors.billing}>Billing</Button>
              <Button className={moduleGradientColors.reports}>Reports</Button>
              <Button className={moduleGradientColors.settings}>Settings</Button>
              <Button className={moduleGradientColors["super-admin"]}>Super Admin</Button>
              <Button className={moduleGradientColors["public-lookup"]}>Public Lookup</Button>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold">All Palette Gradient Buttons</h3>
            <div className="flex flex-wrap gap-3">
              {gradientColors.map((gradient, idx) => (
                <Button key={idx} className={`${gradient} text-white shadow-md hover:shadow-lg transition-all`}>
                  Gradient {idx + 1}
                </Button>
              ))}
            </div>
          </section>

          {/* Badges */}
          <section>
            <h3 className="mb-3 font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-destructive">
                <MdCancel />
                Cancelled
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-emerald-500">
                <FaCheckCircle />
                Deposited
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-amber-500">
                <FaClock />
                Pending
              </Badge>
            </div>
          </section>

          {/* Inputs & Focus */}
          <section>
            <h3 className="mb-3 font-semibold">Form Controls</h3>
            <div className="max-w-xs space-y-3">
              <Input placeholder="Default Input" />
              <Input placeholder="Disabled Input" disabled />
            </div>
          </section>

          {/* Alerts */}
          <section>
            <h3 className="mb-3 font-semibold">Alerts</h3>
            <div className="space-y-3">
              <Alert>
                <AlertTitle font-semibold>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle font-semibold>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemePage;
