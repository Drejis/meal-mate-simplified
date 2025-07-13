import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  meals: number;
  popular?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "daily",
    name: "Daily Fresh",
    price: 2500,
    originalPrice: 3000,
    description: "Perfect for trying out our service",
    meals: 1,
    features: ["1 meal per day", "Free delivery", "24/7 support", "Cancel anytime"]
  },
  {
    id: "weekly",
    name: "Weekly Essentials",
    price: 15000,
    originalPrice: 18000,
    description: "Most popular for busy professionals",
    meals: 7,
    popular: true,
    features: ["7 meals per week", "20% discount", "Priority delivery", "Meal customization", "Nutrition tracking"]
  },
  {
    id: "monthly",
    name: "Monthly Premium",
    price: 50000,
    originalPrice: 65000,
    description: "Best value for committed members",
    meals: 30,
    features: ["30 meals per month", "35% discount", "Premium ingredients", "Chef specials", "Personal nutrition coach", "Exclusive recipes"]
  }
];

const PlanSelector = () => {
  const [selectedPlan, setSelectedPlan] = useState("weekly");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible subscription plans designed for your lifestyle. 
            Change or cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative p-8 cursor-pointer transition-all duration-300 animate-slide-up hover:shadow-strong ${
                selectedPlan === plan.id 
                  ? "ring-2 ring-primary shadow-medium scale-105" 
                  : "hover:scale-102"
              } ${plan.popular ? "border-primary/50" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-warm text-white">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">
                      ₦{plan.price.toLocaleString()}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₦{plan.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {plan.meals} meal{plan.meals > 1 ? 's' : ''} • ₦{Math.round(plan.price / plan.meals).toLocaleString()} per meal
                  </div>
                  
                  {plan.originalPrice && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? "bg-gradient-fresh hover:shadow-medium"
                    : "bg-gradient-warm hover:shadow-medium"
                }`}
                size="lg"
              >
                {selectedPlan === plan.id ? "Selected Plan" : "Choose This Plan"}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-fresh hover:shadow-medium transition-all duration-300">
            Continue with {plans.find(p => p.id === selectedPlan)?.name}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free cancellation • No hidden fees • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlanSelector;