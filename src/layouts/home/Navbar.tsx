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
import { AppButton, AppLogo } from "@/components/common";
import { getDashboardRoute } from "@/lib/utils";
import { useAuthStore } from "@/api/auth/auth.store";
import { useLogout } from "@/api/auth/useAuth";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const logout = useLogout();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Verify Contribution", href: "/contributor-lookup" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`sticky z-50 transition-all duration-300 ${
        scrolled
          ? "top-3 mx-auto w-[92%] max-w-7xl rounded-full border border-border/60 bg-background/85 backdrop-blur-sm shadow-lg"
          : "top-0 w-full bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
        {/* Left Section: Logo */}
        <div className="flex flex-1 items-center">
          <AppLogo />
        </div>

        {/* Center Section: Links */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section: Auth & Actions */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AppButton
                  variant="ghost"
                  size="icon"
                  className="hidden rounded-full md:flex border border-border/50"
                >
                  <User className="h-4.5 w-4.5" />
                </AppButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 rounded-xl p-1.5 shadow-xl"
              >
                <div className="px-3 py-2">
                  <p className="font-semibold text-sm text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link to={getDashboardRoute(user)} className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Desktop Auth CTA */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <Link
                to={getDashboardRoute(user)}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-border/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/60 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Sheet Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <AppButton variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </AppButton>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-6">
              <SheetTitle className="text-left text-lg font-bold">
                <AppLogo />
              </SheetTitle>

              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-muted text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="my-3 border-t border-border/60" />

                {isAuthenticated ? (
                  <>
                    <div className="rounded-xl border border-border p-3.5 bg-muted/40 mb-2">
                      <p className="font-semibold text-sm text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link to={getDashboardRoute(user)}>
                      <AppButton variant="ghost" className="w-full">
                        Dashboard
                      </AppButton>
                    </Link>

                    <AppButton
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={logout}
                    >
                      Logout
                    </AppButton>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex w-full items-center justify-center rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="flex w-full items-center justify-center rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
                    >
                      Get Started
                    </Link>
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
