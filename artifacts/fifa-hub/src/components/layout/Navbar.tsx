import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/fixtures", label: "Matches" },
    { href: "/teams", label: "Teams" },
    { href: "/groups", label: "Groups" },
    { href: "/bracket", label: "Bracket" },
    { href: "/news", label: "News" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${isScrolled ? "bg-background border-b border-border/40" : "bg-transparent"}`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 flex h-[72px] items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/">
          <a 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              if (location === "/") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="font-display text-2xl font-bold tracking-widest text-foreground">
              FIFA <span className="text-primary">HUB</span>
            </span>
          </a>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {links.map(({ href, label }) => {
            const isActive = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href} className="relative flex items-center h-full group">
                <span className={`text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}>
                  {label}
                </span>
                {/* Thin gold active indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center h-full group outline-none">
              <span className={`text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1`}>
                Explore <ChevronDown className="w-4 h-4 opacity-70" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-2xl p-2 rounded-xl mt-2">
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/20 focus:text-primary rounded-lg py-2.5">
                <Link href="/about">🏆 <span className="ml-2 font-medium">About 2026</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/20 focus:text-primary rounded-lg py-2.5">
                <Link href="/stadiums">🏟 <span className="ml-2 font-medium">Stadiums</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/20 focus:text-primary rounded-lg py-2.5">
                <Link href="/host-cities">🌍 <span className="ml-2 font-medium">Host Cities</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/20 focus:text-primary rounded-lg py-2.5">
                <Link href="/history">📜 <span className="ml-2 font-medium">World Cup History</span></Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/20 focus:text-primary rounded-lg py-2.5">
                <Link href="/records">📊 <span className="ml-2 font-medium">Records</span></Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>

        {/* Right: Icons (Removed) */}
        <div className="hidden lg:flex items-center gap-5 w-[104px]">
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card border-l-border">
            <nav className="flex flex-col gap-4 mt-8">
              {links.map(({ href, label }) => {
                const isActive = location === href || (href !== "/" && location.startsWith(href));
                return (
                  <Link key={href} href={href} className={`flex items-center gap-3 text-lg font-medium p-2 rounded-md ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                    {label}
                  </Link>
                );
              })}

              <div className="pt-4 mt-2 border-t border-border">
                <span className="text-xs font-display font-bold text-primary uppercase tracking-widest px-2 block mb-3">Explore</span>
                <Link href="/about" className="flex items-center gap-3 text-lg font-medium p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  🏆 About 2026
                </Link>
                <Link href="/stadiums" className="flex items-center gap-3 text-lg font-medium p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  🏟 Stadiums
                </Link>
                <Link href="/host-cities" className="flex items-center gap-3 text-lg font-medium p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  🌍 Host Cities
                </Link>
                <Link href="/history" className="flex items-center gap-3 text-lg font-medium p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  📜 World Cup History
                </Link>
                <Link href="/records" className="flex items-center gap-3 text-lg font-medium p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  📊 Records
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
