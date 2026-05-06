import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gradientColors } from "./colors";
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
            <h3 className="mb-3 font-semibold">Buttons (Recommended Usage)</h3>
            <div className="flex flex-wrap gap-3">
              <Button className={gradientColors[0]}>Dashboard</Button>
              <Button className={gradientColors[1]}>Contributions</Button>
              <Button className={gradientColors[2]}>Reports</Button>
              <Button className={gradientColors[3]}>Settings</Button>
              <Button className={gradientColors[4]}>Settings</Button>
              <Button className={gradientColors[5]}>Settings</Button>
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
              <Badge variant="cancelled">
                <MdCancel />
                Cancelled
              </Badge>
              <Badge variant="deposited">
                <FaCheckCircle />
                Deposited
              </Badge>
              <Badge variant="pending">
                <FaClock />
                Pending
              </Badge>
            </div>
          </section>

          {/* Inputs & Focus */}
          <section>
            <h3 className="mb-3 font-semibold">Inputs & Focus Ring</h3>
            <div className="max-w-sm space-y-3">
              <Input placeholder="Focus me to see ring color" />
              <p className="text-sm text-muted-foreground">
                Focus ring uses <code>--ring</code> token
              </p>
            </div>
          </section>

          {/* Alerts */}
          <section>
            <h3 className="mb-3 font-semibold">Alerts</h3>
            <div className="grid gap-3 max-w-xl">
              <Alert>
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                  Uses background, border and foreground tokens.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Uses destructive color tokens.</AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Text & Foreground */}
          <section>
            <h3 className="mb-3 font-semibold">Text & Foreground</h3>
            <div className="space-y-2">
              <p className="text-foreground">Primary foreground text</p>
              <p className="text-muted-foreground">
                Muted foreground (descriptions, hints)
              </p>
              <p className="text-primary font-medium">Primary colored text</p>
              <p className="text-destructive font-medium">Destructive / error text</p>
            </div>
          </section>

          {/* Border & Ring */}
          <section>
            <h3 className="mb-3 font-semibold">Border & Ring</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorBlock name="Border" className="border-4 border-border" recommended />
              <ColorBlock name="Input" className="bg-input" />
              <ColorBlock name="Ring" className="ring-4 ring-ring" recommended />
            </div>
          </section>

          {/* Sidebar */}
          <section>
            <h3 className="mb-3 font-semibold">Sidebar Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorBlock name="Sidebar" className="bg-sidebar" />
              <ColorBlock
                name="Sidebar Primary"
                className="bg-sidebar-primary"
                recommended
              />
              <ColorBlock name="Sidebar Accent" className="bg-sidebar-accent" />
            </div>
          </section>

          {/* Charts */}
          <section>
            <h3 className="mb-3 font-semibold">Charts</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ColorBlock name="Chart 1" className="bg-[color:var(--chart-1)]" />
              <ColorBlock name="Chart 2" className="bg-[color:var(--chart-2)]" />
              <ColorBlock name="Chart 3" className="bg-[color:var(--chart-3)]" />
              <ColorBlock name="Chart 4" className="bg-[color:var(--chart-4)]" />
              <ColorBlock name="Chart 5" className="bg-[color:var(--chart-5)]" />
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemePage;
