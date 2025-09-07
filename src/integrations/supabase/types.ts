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
      invoices: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          description: string | null
          due_date: string | null
          dwolla_customer_id: string | null
          dwolla_funding_source_id: string | null
          dwolla_transfer_id: string | null
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
          dwolla_customer_id?: string | null
          dwolla_funding_source_id?: string | null
          dwolla_transfer_id?: string | null
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
          dwolla_customer_id?: string | null
          dwolla_funding_source_id?: string | null
          dwolla_transfer_id?: string | null
          id?: string
          status?: string
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
