import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Check, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReferralSystem from '@/components/ReferralSystem';

interface WeeklyMeal {
  id: string;
  scheduled_date: string;
  is_eaten: boolean;
  is_skipped: boolean;
  meals: {
    id: string;
    name: string;
    image_url: string;
    description: string;
    calories: number;
    category: string;
  };
}

interface AvailableMeal {
  id: string;
  name: string;
  image_url: string;
  category: string;
  calories: number;
}

const MealPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeal[]>([]);
  const [availableMeals, setAvailableMeals] = useState<AvailableMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchWeeklyMeals();
      fetchAvailableMeals();
    }
  }, [user, currentWeek]);

  const fetchWeeklyMeals = async () => {
    try {
      const weekStart = getWeekStart(currentWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { data, error } = await supabase
        .from('weekly_meal_schedules')
        .select(`
          *,
          meals (id, name, image_url, description, calories, category)
        `)
        .eq('user_id', user?.id)
        .gte('scheduled_date', weekStart.toISOString().split('T')[0])
        .lte('scheduled_date', weekEnd.toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setWeeklyMeals(data || []);
    } catch (error) {
      console.error('Error fetching weekly meals:', error);
    }
  };

  const fetchAvailableMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('id, name, image_url, category, calories')
        .eq('is_available', true);

      if (error) throw error;
      setAvailableMeals(data || []);
    } catch (error) {
      console.error('Error fetching available meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    start.setDate(diff);
    return start;
  };

  const getWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const markMealEaten = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('weekly_meal_schedules')
        .update({ is_eaten: true, is_skipped: false })
        .eq('id', mealId);

      if (error) throw error;
      fetchWeeklyMeals();
    } catch (error) {
      console.error('Error marking meal as eaten:', error);
    }
  };

  const skipMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('weekly_meal_schedules')
        .update({ is_skipped: true, is_eaten: false })
        .eq('id', mealId);

      if (error) throw error;
      fetchWeeklyMeals();
    } catch (error) {
      console.error('Error skipping meal:', error);
    }
  };

  const swapMeal = async (scheduleId: string, newMealId: string) => {
    try {
      const { error } = await supabase
        .from('weekly_meal_schedules')
        .update({ meal_id: newMealId })
        .eq('id', scheduleId);

      if (error) throw error;
      fetchWeeklyMeals();
    } catch (error) {
      console.error('Error swapping meal:', error);
    }
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = getWeekDays(weekStart);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your meal plan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meal Planner</h1>
            <p className="text-muted-foreground">Manage your weekly meals and track your nutrition</p>
          </div>
        </div>

        <Tabs defaultValue="planner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
            <TabsTrigger value="referrals">Refer & Earn</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-6">
            {/* Week Navigation */}
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Week of {weekStart.toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </CardTitle>
                    <CardDescription>
                      Plan and track your meals for the week
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Weekly Meal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekDays.map((day, index) => {
                const dayMeals = weeklyMeals.filter(
                  meal => meal.scheduled_date === day.toISOString().split('T')[0]
                );
                
                return (
                  <Card key={day.toISOString()} className="shadow-soft">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">
                        {day.toLocaleDateString('en-NG', { weekday: 'short' })}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {day.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {dayMeals.length > 0 ? (
                        dayMeals.map((meal) => (
                          <div key={meal.id} className="space-y-2">
                            <div className="relative">
                              <img
                                src={meal.meals.image_url}
                                alt={meal.meals.name}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              {meal.is_eaten && (
                                <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                                  <Check className="w-6 h-6 text-green-600" />
                                </div>
                              )}
                              {meal.is_skipped && (
                                <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                  <X className="w-6 h-6 text-red-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-medium line-clamp-2">{meal.meals.name}</h4>
                              <p className="text-xs text-muted-foreground">{meal.meals.calories} cal</p>
                            </div>
                            <div className="flex gap-1">
                              {!meal.is_eaten && !meal.is_skipped && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markMealEaten(meal.id)}
                                    className="h-6 text-xs px-2"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => skipMeal(meal.id)}
                                    className="h-6 text-xs px-2"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs px-2"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">No meals scheduled</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Meal Summary */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Week Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{weeklyMeals.length}</div>
                    <div className="text-sm text-muted-foreground">Scheduled Meals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {weeklyMeals.filter(m => m.is_eaten).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Meals Eaten</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {weeklyMeals.filter(m => m.is_skipped).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Meals Skipped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {weeklyMeals.reduce((sum, meal) => sum + (meal.meals?.calories || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Calories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralSystem />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default MealPlanner;