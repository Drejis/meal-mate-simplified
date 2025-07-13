import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, Star, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import heroMeal from "@/assets/hero-meal.jpg";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartPlan = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-white/90" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Fresh Meals
                <span className="block text-primary">Delivered Daily</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Perfect for busy singles. Nutritious, delicious meals planned just for you. 
                Skip the grocery store, skip the stress.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Happy Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">30min</div>
                <div className="text-sm text-muted-foreground">Avg Delivery</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleStartPlan}
                className="bg-gradient-fresh hover:shadow-medium transition-all duration-300"
              >
                {user ? 'Go to Dashboard' : 'Start Your Plan'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                View Sample Meals
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-0 shadow-soft">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">15-min prep</span>
                </div>
              </Card>
              <Card className="p-4 border-0 shadow-soft">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Single portions</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <img
                src={heroMeal}
                alt="Fresh healthy meal with grilled chicken and vegetables"
                className="w-full h-auto rounded-2xl shadow-strong animate-float"
              />
              
              {/* Floating badges */}
              <Card className="absolute -top-4 -left-4 p-3 shadow-medium animate-bounce-in bg-white">
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">₦2,500</div>
                  <div className="text-xs text-muted-foreground">per meal</div>
                </div>
              </Card>
              
              <Card className="absolute -bottom-4 -right-4 p-3 shadow-medium animate-bounce-in bg-primary text-primary-foreground">
                <div className="text-center">
                  <div className="text-sm font-bold">Fresh Daily</div>
                  <div className="text-xs opacity-90">Delivered Hot</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;