import { Link } from "@tanstack/react-router";
import { Menu, User, LayoutDashboard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { AppButton } from "@/components/common/AppButton";
import { getDashboardRoute } from "@/lib/utils";
import { useAuthStore } from "@/api/auth/auth.store";
import { useLogout } from "@/api/hooks/useAuth";
const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const logout = useLogout();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Reviews", href: "/#reviews" },
  ];

  return (
    <nav
      className={`sticky z-50 transition-all duration-500
    ${
      scrolled
        ? "top-3 mx-auto w-[90%] max-w-7xl rounded-full border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl"
        : "top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
        {/* ================= Left Section ================= */}
        <div className="flex flex-1 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <AppButton>F</AppButton>
            </div>
          </Link>
        </div>

        {/* ================= Center Navigation ================= */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex items-center gap-2 rounded-full bg-background/60 px-2 py-1 backdrop-blur">
            {navLinks.map((link) => (
              <AppButton key={link.href} variant="ghost">
                <Link to={link.href}>{link.name}</Link>
              </AppButton>
            ))}
          </div>
        </div>

        {/* ================= Right Section ================= */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AppButton
                  variant="ghost"
                  size="icon"
                  className="hidden rounded-full md:flex"
                >
                  <User className="h-5 w-5" />
                </AppButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                <div className="px-3 py-2">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to={getDashboardRoute(user)} className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <AppButton>
                <Link to={getDashboardRoute(user)}>Dashboard</Link>
              </AppButton>
            ) : (
              <>
                <AppButton variant="outline">
                  <Link to="/login">Login</Link>
                </AppButton>

                <AppButton>
                  <Link to="/signup">Get Started</Link>
                </AppButton>
              </>
            )}
          </div>

          {/* ================= Mobile Menu ================= */}
          <Sheet>
            <SheetTrigger asChild>
              <AppButton variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </AppButton>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6">
              <SheetTitle>Navigation</SheetTitle>

              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="rounded-lg px-4 py-3 text-sm font-medium transition hover:bg-muted"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="my-4 border-t" />

                {isAuthenticated ? (
                  <>
                    <div className="rounded-lg border p-4">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>

                    <AppButton className="w-full">
                      <Link to={getDashboardRoute(user)}>Dashboard</Link>
                    </AppButton>

                    <AppButton variant="outline" className="w-full" onClick={logout}>
                      Logout
                    </AppButton>
                  </>
                ) : (
                  <>
                    <AppButton variant="outline" className="w-full">
                      <Link to="/login">Login</Link>
                    </AppButton>

                    <AppButton className="w-full">
                      <Link to="/signup">Get Started</Link>
                    </AppButton>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
