import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navItems = [
    { label: "How it Works", href: "#how" },
    { label: "Menu", href: "#menu" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#reviews" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-fresh rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">MealMate</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="border-secondary text-secondary hover:bg-secondary/5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-fresh hover:shadow-medium transition-all duration-300"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-fresh rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">MealMate</span>
                </div>

                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-lg text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}

                <div className="flex flex-col gap-3 mt-6">
                  {user ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                        className="border-primary text-primary"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        className="border-secondary text-secondary"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => { navigate('/auth'); setIsOpen(false); }}
                        className="border-primary text-primary"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => { navigate('/auth'); setIsOpen(false); }}
                        className="bg-gradient-fresh"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;