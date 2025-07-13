export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      discount_coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      meal_orders: {
        Row: {
          created_at: string
          delivery_date: string | null
          delivery_status: string | null
          discount_amount: number | null
          final_amount: number
          id: string
          payment_method: string | null
          payment_status: string | null
          subscription_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_date?: string | null
          delivery_status?: string | null
          discount_amount?: number | null
          final_amount: number
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          subscription_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_date?: string | null
          delivery_status?: string | null
          discount_amount?: number | null
          final_amount?: number
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          subscription_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_orders_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          meals_per_week: number
          name: string
          price_per_meal: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          meals_per_week: number
          name: string
          price_per_meal: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          meals_per_week?: number
          name?: string
          price_per_meal?: number
          updated_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          category: string | null
          created_at: string
          description: string | null
          fat: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          protein: number | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          fat?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          protein?: number | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          fat?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          protein?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          business_name: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          kyc_status: string | null
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_type?: string | null
          business_name?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          kyc_status?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_type?: string | null
          business_name?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          kyc_status?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string | null
          reward_amount: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id?: string | null
          reward_amount?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string | null
          reward_amount?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          converted_amount: number | null
          created_at: string
          description: string | null
          exchange_rate: number | null
          fees: number | null
          from_currency: string
          id: string
          recipient_account: string | null
          recipient_bank: string | null
          recipient_email: string | null
          recipient_name: string | null
          reference: string | null
          status: string | null
          to_currency: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          converted_amount?: number | null
          created_at?: string
          description?: string | null
          exchange_rate?: number | null
          fees?: number | null
          from_currency: string
          id?: string
          recipient_account?: string | null
          recipient_bank?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          reference?: string | null
          status?: string | null
          to_currency?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          converted_amount?: number | null
          created_at?: string
          description?: string | null
          exchange_rate?: number | null
          fees?: number | null
          from_currency?: string
          id?: string
          recipient_account?: string | null
          recipient_bank?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          reference?: string | null
          status?: string | null
          to_currency?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          is_used: boolean | null
          source: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          is_used?: boolean | null
          source: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          is_used?: boolean | null
          source?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          delivery_address: string | null
          delivery_days: string[] | null
          delivery_time_slot: string | null
          dietary_preferences: string[] | null
          end_date: string | null
          id: string
          meal_plan_id: string | null
          start_date: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          delivery_days?: string[] | null
          delivery_time_slot?: string | null
          dietary_preferences?: string[] | null
          end_date?: string | null
          id?: string
          meal_plan_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          delivery_days?: string[] | null
          delivery_time_slot?: string | null
          dietary_preferences?: string[] | null
          end_date?: string | null
          id?: string
          meal_plan_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          currency: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      weekly_meal_schedules: {
        Row: {
          created_at: string
          id: string
          is_eaten: boolean | null
          is_skipped: boolean | null
          meal_id: string | null
          scheduled_date: string
          subscription_id: string | null
          updated_at: string
          user_id: string | null
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_eaten?: boolean | null
          is_skipped?: boolean | null
          meal_id?: string | null
          scheduled_date: string
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          is_eaten?: boolean | null
          is_skipped?: boolean | null
          meal_id?: string | null
          scheduled_date?: string
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_meal_schedules_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_meal_schedules_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
