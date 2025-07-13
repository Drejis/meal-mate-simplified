import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Zap, Heart, Utensils } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  description: string;
  image_url: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  is_available: boolean;
}

const MealGrid = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeals = selectedCategory === 'all' 
    ? meals 
    : meals.filter(meal => meal.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'All Meals', icon: Utensils },
    { value: 'regular', label: 'Regular', icon: Utensils },
    { value: 'vegan', label: 'Vegan', icon: Heart },
    { value: 'high-protein', label: 'High Protein', icon: Zap }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vegan': return 'bg-green-100 text-green-800';
      case 'high-protein': return 'bg-blue-100 text-blue-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading delicious meals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white" id="menu">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Our <span className="text-primary">Nigerian Menu</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Authentic Nigerian dishes prepared fresh daily with locally sourced ingredients
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.value 
                    ? "bg-gradient-fresh text-white" 
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeals.map((meal) => (
            <Card
              key={meal.id}
              className="group shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={meal.image_url}
                  alt={meal.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-3 right-3 ${getCategoryColor(meal.category)}`}
                >
                  {meal.category.replace('-', ' ')}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{meal.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {meal.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{meal.protein}g protein</span>
                  </div>
                </div>
                
                {/* Nutrition Info */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-primary">{meal.protein}g</div>
                      <div className="text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-secondary">{meal.carbs}g</div>
                      <div className="text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-accent">{meal.fat}g</div>
                      <div className="text-muted-foreground">Fat</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-fresh hover:shadow-medium">
                  Add to Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No meals found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category to see available meals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MealGrid;