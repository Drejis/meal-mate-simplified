import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, Gift, Users, Wallet, Share2, CheckCircle } from 'lucide-react';

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
  pending_earnings: number;
}

const ReferralSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      // Check if user has a referral code
      let { data: existingReferral } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_user_id', user?.id)
        .single();

      let referralCode = existingReferral?.referral_code;

      // Generate referral code if doesn't exist
      if (!referralCode) {
        referralCode = `MEAL${user?.email?.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        await supabase
          .from('referrals')
          .insert({
            referrer_user_id: user?.id,
            referral_code: referralCode,
            reward_amount: 500 // Default reward amount
          });
      }

      // Get referral stats
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user?.id);

      const { data: credits } = await supabase
        .from('user_credits')
        .select('amount, is_used')
        .eq('user_id', user?.id)
        .eq('source', 'referral');

      const totalReferrals = referrals?.length || 0;
      const totalEarnings = credits?.reduce((sum, credit) => sum + Number(credit.amount), 0) || 0;
      const pendingEarnings = credits?.filter(c => !c.is_used).reduce((sum, credit) => sum + Number(credit.amount), 0) || 0;

      setReferralData({
        referral_code: referralCode,
        total_referrals: totalReferrals,
        total_earnings: totalEarnings,
        pending_earnings: pendingEarnings
      });

    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralData?.referral_code) {
      navigator.clipboard.writeText(referralData.referral_code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferral = () => {
    const message = `Join MealMate with my referral code ${referralData?.referral_code} and get ₦500 off your first order! Fresh Nigerian meals delivered daily. 🍛`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join MealMate',
        text: message,
        url: window.location.origin
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(message);
      toast({
        title: "Copied!",
        description: "Referral message copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <Card className="shadow-medium">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading referral data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Overview */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Refer & Earn
          </CardTitle>
          <CardDescription>
            Share MealMate with friends and earn ₦500 for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{referralData?.total_referrals}</div>
              <div className="text-sm text-muted-foreground">Total Referrals</div>
            </div>
            
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <Wallet className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">₦{referralData?.total_earnings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </div>
            
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <Gift className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">₦{referralData?.pending_earnings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Available Credits</div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
              <div className="flex gap-2">
                <Input
                  value={referralData?.referral_code || ''}
                  readOnly
                  className="font-mono text-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyReferralCode}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={shareReferral}
              className="w-full bg-gradient-fresh hover:shadow-medium"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share with Friends
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Share Your Code</h4>
                <p className="text-sm text-muted-foreground">
                  Send your referral code to friends via WhatsApp, Instagram, or any social platform
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Friend Signs Up</h4>
                <p className="text-sm text-muted-foreground">
                  Your friend creates an account and places their first order of ₦3,000 or more
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-semibold">You Both Earn</h4>
                <p className="text-sm text-muted-foreground">
                  You get ₦500 credit, and your friend gets ₦500 off their first order
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Terms & Conditions</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Referral credits are added within 24 hours of successful referral</li>
            <li>• Minimum order value of ₦3,000 required for referral to be valid</li>
            <li>• Credits can be used towards future meal orders</li>
            <li>• Credits expire after 90 days if unused</li>
            <li>• Self-referrals are not allowed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralSystem;