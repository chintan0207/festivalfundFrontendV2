import { Link } from "react-router-dom";
import { Menu, User, LayoutDashboard, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/theme/ThemeToggle";
import { AppButton } from "@/components/common/AppButton";
const Navbar = () => {
  
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
      ? "top-3 mx-auto rounded-full border bg-background/70 backdrop-blur-xl shadow-lg px-6 scale-[0.97]"
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

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AppButton variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </AppButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />

          {/* Desktop Buttons */}
          <AppButton size="sm" className="hidden md:flex">
            <Link to="/login">Login</Link>
          </AppButton>

          <AppButton size="sm" className="hidden md:flex">
            <Link to="/signup">Sign Up</Link>
          </AppButton>
          <AppButton size="sm" className="hidden md:flex">
            <Link to="/dashboard">Dashboard</Link>
          </AppButton>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <AppButton variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </AppButton>
            </SheetTrigger>

            <SheetContent side="right" className="bg-background p-4">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <AppButton
                    className="justify-start"
                    variant={"ghost"}
                    key={link.href}
                  >
                    <Link key={link.href} to={link.href}>
                      {link.name}
                    </Link>
                  </AppButton>
                ))}

                <AppButton variant="outline" className="w-full">
                  <Link to="/login">Login</Link>
                </AppButton>

                <AppButton className="w-full">
                  <Link to="/signup">Sign Up</Link>
                </AppButton>

                <AppButton className="w-full">
                  <Link to="/dashboard">Dashboard</Link>
                </AppButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
