import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Truck, Gift, CreditCard, Bell } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserSubscription {
  id: string;
  meal_plan_id: string;
  status: string;
  delivery_days: string[];
  meal_plans: {
    name: string;
    price_per_meal: number;
    meals_per_week: number;
  };
}

interface UpcomingMeal {
  id: string;
  scheduled_date: string;
  meals: {
    name: string;
    image_url: string;
  };
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [upcomingMeals, setUpcomingMeals] = useState<UpcomingMeal[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          meal_plans (name, price_per_meal, meals_per_week)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      setSubscription(subscriptionData);

      // Fetch upcoming meals
      const { data: mealsData } = await supabase
        .from('weekly_meal_schedules')
        .select(`
          *,
          meals (name, image_url)
        `)
        .eq('user_id', user?.id)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true })
        .limit(3);

      setUpcomingMeals(mealsData || []);

      // Fetch user credits
      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('amount')
        .eq('user_id', user?.id)
        .eq('is_used', false);

      const totalCredits = creditsData?.reduce((sum, credit) => sum + Number(credit.amount), 0) || 0;
      setCredits(totalCredits);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your meal plan
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Plan</p>
                  <p className="text-lg font-semibold">
                    {subscription?.meal_plans.name || 'No Plan'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-lg font-semibold">
                    {subscription?.meal_plans.meals_per_week || 0} Meals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Credits</p>
                  <p className="text-lg font-semibold">₦{credits.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Next Delivery</p>
                  <p className="text-lg font-semibold">
                    {upcomingMeals[0] ? new Date(upcomingMeals[0].scheduled_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Meals */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Meals
                </CardTitle>
                <CardDescription>
                  Your scheduled meals for this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMeals.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeals.map((meal) => (
                      <div key={meal.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={meal.meals.image_url}
                          alt={meal.meals.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{meal.meals.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(meal.scheduled_date).toLocaleDateString('en-NG', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming meals scheduled</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/'}>
                      Browse Meal Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Pause Plan
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.location.href = '/planner'}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Meal Planner
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Refer & Earn
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing & Payment
                </Button>
              </CardContent>
            </Card>

            {/* Current Subscription */}
            {subscription && (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <span className="font-semibold">{subscription.meal_plans.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Per Meal</span>
                      <span className="font-semibold">₦{subscription.meal_plans.price_per_meal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Weekly</span>
                      <span className="font-semibold">{subscription.meal_plans.meals_per_week} meals</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        {subscription.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">
                      Your next delivery is tomorrow!
                    </p>
                    <p className="text-xs text-blue-700">
                      Jollof Rice with Grilled Chicken
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900">
                      You earned ₦500 credits!
                    </p>
                    <p className="text-xs text-green-700">
                      From your friend's signup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;