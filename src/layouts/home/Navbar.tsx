import { Link } from "react-router-dom";
import { Menu, User, LayoutDashboard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { AppButton } from "@/components/common/AppButton";
import { getDashboardRoute } from "@/lib/utils";
import { useAuthStore } from "@/api/auth/auth.store";
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
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
    { name: "Features", href: "/#services" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Reviews", href: "/#reviews" },
  ];

  return (
    <nav
      className={`sticky z-50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform
  ${
    scrolled
      ? "top-3 mx-auto max-w-5xl rounded-full border bg-background/70 backdrop-blur-xl shadow-lg px-6 scale-[0.97]"
      : "top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 scale-100"
  }`}
    >
      {" "}
      <div className="container mx-auto flex h-16 items-center justify-between md:px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <AppButton>F</AppButton>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <AppButton variant={"ghost"} key={link.href}>
                <Link key={link.href} to={link.href}>
                  {link.name}
                </Link>
              </AppButton>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Button */}
          <ThemeToggle />

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <AppButton variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </AppButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 text-sm font-medium">{user?.name}</div>
                <div className="px-2 py-1 text-xs text-muted-foreground">{user?.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={getDashboardRoute(user)} className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isAuthenticated ? (
            <AppButton className="hidden md:flex">
              <Link to={getDashboardRoute(user)}>Dashboard</Link>
            </AppButton>
          ) : (
            <>
              <AppButton variant="outline" className="hidden md:flex">
                <Link to="/login">Login</Link>
              </AppButton>
              <AppButton className="hidden md:flex">
                <Link to="/signup">Get Started</Link>
              </AppButton>
            </>
          )}

          {/* Login Button (Desktop) */}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger>
              <AppButton variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </AppButton>
            </SheetTrigger>

            <SheetContent className="p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">Mobile navigation</SheetDescription>

              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <AppButton className="w-full">
                      <Link to={getDashboardRoute(user)}>Dashboard</Link>
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
