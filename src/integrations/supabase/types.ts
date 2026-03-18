export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_exclusive: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_exclusive?: boolean | null
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_exclusive?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      booking_activities: {
        Row: {
          activity_id: string
          booking_id: string
          id: string
        }
        Insert: {
          activity_id: string
          booking_id: string
          id?: string
        }
        Update: {
          activity_id?: string
          booking_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_activities_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_decorations: {
        Row: {
          booking_id: string
          decoration_theme_id: string
          id: string
        }
        Insert: {
          booking_id: string
          decoration_theme_id: string
          id?: string
        }
        Update: {
          booking_id?: string
          decoration_theme_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_decorations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_decorations_decoration_theme_id_fkey"
            columns: ["decoration_theme_id"]
            isOneToOne: false
            referencedRelation: "decoration_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_extras: {
        Row: {
          booking_id: string
          extra_id: string
          id: string
          quantity: number | null
        }
        Insert: {
          booking_id: string
          extra_id: string
          id?: string
          quantity?: number | null
        }
        Update: {
          booking_id?: string
          extra_id?: string
          id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_extras_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_extras_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "extras"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_furniture: {
        Row: {
          booking_id: string
          furniture_id: string
          id: string
          quantity: number | null
        }
        Insert: {
          booking_id: string
          furniture_id: string
          id?: string
          quantity?: number | null
        }
        Update: {
          booking_id?: string
          furniture_id?: string
          id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_furniture_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_furniture_furniture_id_fkey"
            columns: ["furniture_id"]
            isOneToOne: false
            referencedRelation: "event_furniture"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_mascots: {
        Row: {
          booking_id: string
          id: string
          mascot_id: string
        }
        Insert: {
          booking_id: string
          id?: string
          mascot_id: string
        }
        Update: {
          booking_id?: string
          id?: string
          mascot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_mascots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_mascots_mascot_id_fkey"
            columns: ["mascot_id"]
            isOneToOne: false
            referencedRelation: "mascots"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          email: string
          event_date: string
          event_time: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          full_name: string
          id: string
          is_guest: boolean | null
          location: string
          notes: string | null
          package_id: string | null
          phone: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_date: string
          event_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          full_name: string
          id?: string
          is_guest?: boolean | null
          location: string
          notes?: string | null
          package_id?: string | null
          phone: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string
          event_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          full_name?: string
          id?: string
          is_guest?: boolean | null
          location?: string
          notes?: string | null
          package_id?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      decoration_categories: {
        Row: {
          created_at: string
          description: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      decoration_themes: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          theme: Database["public"]["Enums"]["decoration_theme"] | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price?: number
          theme?: Database["public"]["Enums"]["decoration_theme"] | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          theme?: Database["public"]["Enums"]["decoration_theme"] | null
        }
        Relationships: [
          {
            foreignKeyName: "decoration_themes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "decoration_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      event_furniture: {
        Row: {
          cover_color: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          quantity_available: number | null
        }
        Insert: {
          cover_color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number
          quantity_available?: number | null
        }
        Update: {
          cover_color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          quantity_available?: number | null
        }
        Relationships: []
      }
      event_gallery: {
        Row: {
          created_at: string
          description: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string
          image_url: string
          is_featured: boolean | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      extras: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          quantity_available: number
          quantity_total: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quantity_available?: number
          quantity_total?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quantity_available?: number
          quantity_total?: number
          updated_at?: string
        }
        Relationships: []
      }
      loyalty: {
        Row: {
          created_at: string
          discount_eligible: boolean | null
          id: string
          loyalty_points: number | null
          total_bookings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_eligible?: boolean | null
          id?: string
          loyalty_points?: number | null
          total_bookings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_eligible?: boolean | null
          id?: string
          loyalty_points?: number | null
          total_bookings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mascots: {
        Row: {
          category: string | null
          character: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          character?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          character?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      package_activities: {
        Row: {
          activity_id: string
          id: string
          package_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          package_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_activities_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_mascots: {
        Row: {
          id: string
          mascot_id: string
          package_id: string
        }
        Insert: {
          id?: string
          mascot_id: string
          package_id: string
        }
        Update: {
          id?: string
          mascot_id?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_mascots_mascot_id_fkey"
            columns: ["mascot_id"]
            isOneToOne: false
            referencedRelation: "mascots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_mascots_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          includes_addons: string[] | null
          is_active: boolean | null
          is_popular: boolean | null
          max_mascots: number
          name: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          includes_addons?: string[] | null
          is_active?: boolean | null
          is_popular?: boolean | null
          max_mascots?: number
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          includes_addons?: string[] | null
          is_active?: boolean | null
          is_popular?: boolean | null
          max_mascots?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      photo_services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          is_visible: boolean | null
          rating: number
          staff_user_id: string | null
          user_id: string | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          rating: number
          staff_user_id?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          rating?: number
          staff_user_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          notes: string | null
          role: string | null
          staff_user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          notes?: string | null
          role?: string | null
          staff_user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          role?: string | null
          staff_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      booking_status: "pending" | "accepted" | "rejected" | "completed"
      decoration_theme:
        | "elegant"
        | "classic"
        | "luxury"
        | "romantic"
        | "modern"
        | "minimal"
        | "princess"
        | "barbie"
        | "frozen"
        | "pink"
        | "spiderman"
        | "superheroes"
        | "cars"
        | "blue"
        | "custom"
      event_type:
        | "wedding"
        | "engagement"
        | "birthday"
        | "anniversary"
        | "grand_opening"
        | "corporate"
        | "other"
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
    Enums: {
      app_role: ["admin", "staff", "user"],
      booking_status: ["pending", "accepted", "rejected", "completed"],
      decoration_theme: [
        "elegant",
        "classic",
        "luxury",
        "romantic",
        "modern",
        "minimal",
        "princess",
        "barbie",
        "frozen",
        "pink",
        "spiderman",
        "superheroes",
        "cars",
        "blue",
        "custom",
      ],
      event_type: [
        "wedding",
        "engagement",
        "birthday",
        "anniversary",
        "grand_opening",
        "corporate",
        "other",
      ],
    },
  },
} as const
