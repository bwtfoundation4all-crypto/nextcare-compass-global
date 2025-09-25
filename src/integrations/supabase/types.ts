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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_analytics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          session_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          session_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          session_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          consultant_name: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          notes: string | null
          preferred_language: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          consultant_name?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_language?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          consultant_name?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          preferred_language?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      "azureserve.database.windows.net": {
        Row: {
          azure: string | null
        }
        Insert: {
          azure?: string | null
        }
        Update: {
          azure?: string | null
        }
        Relationships: []
      }
      banking_transactions: {
        Row: {
          account_type: string
          bank_name: string
          created_at: string
          encrypted_account_data: string
          id: string
          routing_number_hash: string
          status: string
          updated_at: string
          user_id: string
          verification_id: string
        }
        Insert: {
          account_type: string
          bank_name: string
          created_at?: string
          encrypted_account_data: string
          id?: string
          routing_number_hash: string
          status?: string
          updated_at?: string
          user_id: string
          verification_id: string
        }
        Update: {
          account_type?: string
          bank_name?: string
          created_at?: string
          encrypted_account_data?: string
          id?: string
          routing_number_hash?: string
          status?: string
          updated_at?: string
          user_id?: string
          verification_id?: string
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          assigned_to: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          priority: string | null
          service_type: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          priority?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          priority?: string | null
          service_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_uploads: {
        Row: {
          consultation_request_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          storage_path: string
          user_id: string | null
        }
        Insert: {
          consultation_request_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          storage_path: string
          user_id?: string | null
        }
        Update: {
          consultation_request_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          storage_path?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_uploads_consultation_request_id_fkey"
            columns: ["consultation_request_id"]
            isOneToOne: false
            referencedRelation: "consultation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: boolean | null
          family_member_user_id: string | null
          id: string
          name: string
          phone: string | null
          relationship: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: boolean | null
          family_member_user_id?: string | null
          id?: string
          name: string
          phone?: string | null
          relationship: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: boolean | null
          family_member_user_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          relationship?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_timeline: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          metadata: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          description: string | null
          due_date: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          appointment_reminders: boolean | null
          created_at: string
          email_notifications: boolean | null
          family_updates: boolean | null
          follow_up_reminders: boolean | null
          health_tips: boolean | null
          id: string
          sms_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_reminders?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          family_updates?: boolean | null
          follow_up_reminders?: boolean | null
          health_tips?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_reminders?: boolean | null
          created_at?: string
          email_notifications?: boolean | null
          family_updates?: boolean | null
          follow_up_reminders?: boolean | null
          health_tips?: boolean | null
          id?: string
          sms_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          consultation_request_id: string | null
          created_at: string
          currency: string | null
          id: string
          service_type: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          consultation_request_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          service_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          consultation_request_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          service_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_consultation_request_id_fkey"
            columns: ["consultation_request_id"]
            isOneToOne: false
            referencedRelation: "consultation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          id: string
          metadata: Json | null
          new_role: Database["public"]["Enums"]["app_role"] | null
          old_role: Database["public"]["Enums"]["app_role"] | null
          performed_at: string
          performed_by: string
          target_user_id: string
        }
        Insert: {
          action: string
          id?: string
          metadata?: Json | null
          new_role?: Database["public"]["Enums"]["app_role"] | null
          old_role?: Database["public"]["Enums"]["app_role"] | null
          performed_at?: string
          performed_by: string
          target_user_id: string
        }
        Update: {
          action?: string
          id?: string
          metadata?: Json | null
          new_role?: Database["public"]["Enums"]["app_role"] | null
          old_role?: Database["public"]["Enums"]["app_role"] | null
          performed_at?: string
          performed_by?: string
          target_user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          features: string[] | null
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_event_data?: Json
          p_event_type: string
          p_ip_address?: unknown
          p_session_id?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "employee" | "customer"
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
      app_role: ["admin", "employee", "customer"],
    },
  },
} as const
