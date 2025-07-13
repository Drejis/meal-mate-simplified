import { Card } from "@/components/ui/card";
import { Clock, Shield, Truck, Users, Heart, Zap } from "lucide-react";
import mealVariety from "@/assets/meal-variety.jpg";
import happyCustomer from "@/assets/happy-customer.jpg";

const features = [
  {
    icon: Clock,
    title: "15-Minute Prep",
    description: "Pre-portioned ingredients and simple instructions. Perfect for your busy schedule."
  },
  {
    icon: Heart,
    title: "Nutrition Focused",
    description: "Balanced meals designed by nutritionists. Track your daily intake effortlessly."
  },
  {
    icon: Truck,
    title: "Fresh Delivery",
    description: "Daily delivery windows that fit your schedule. Always fresh, never frozen."
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Premium ingredients sourced locally. 100% satisfaction guarantee."
  },
  {
    icon: Users,
    title: "Single Portions",
    description: "No food waste. Perfect portions designed specifically for one person."
  },
  {
    icon: Zap,
    title: "Instant Rewards",
    description: "Earn points with every order. Refer friends and save even more."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="text-primary">Busy Singles</span> Love MealMate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We understand your lifestyle. That's why we've designed everything 
            around convenience, quality, and your success.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-6 border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-fresh rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Visual Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="relative">
              <img
                src={mealVariety}
                alt="Variety of fresh meal prep bowls"
                className="w-full rounded-2xl shadow-strong"
              />
              <Card className="absolute -bottom-6 -left-6 p-4 bg-white shadow-medium">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">50+</div>
                  <div className="text-sm text-muted-foreground">Weekly Options</div>
                </div>
              </Card>
            </div>

            <div className="relative">
              <img
                src={happyCustomer}
                alt="Happy customer enjoying meal"
                className="w-full rounded-2xl shadow-strong"
              />
              <Card className="absolute -top-6 -right-6 p-4 bg-primary text-primary-foreground shadow-medium">
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9★</div>
                  <div className="text-sm opacity-90">Avg Rating</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10,000+", label: "Happy Members" },
            { number: "50+", label: "Daily Menu Options" },
            { number: "30min", label: "Average Delivery" },
            { number: "99%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="animate-bounce-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;