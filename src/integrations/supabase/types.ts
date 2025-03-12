export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      call_recordings: {
        Row: {
          call_id: string
          created_at: string
          duration: number | null
          file_path: string | null
          id: string
          recording_sid: string
          recording_url: string
          transcription: string | null
          updated_at: string
        }
        Insert: {
          call_id: string
          created_at?: string
          duration?: number | null
          file_path?: string | null
          id?: string
          recording_sid: string
          recording_url: string
          transcription?: string | null
          updated_at?: string
        }
        Update: {
          call_id?: string
          created_at?: string
          duration?: number | null
          file_path?: string | null
          id?: string
          recording_sid?: string
          recording_url?: string
          transcription?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_recordings_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          call_sid: string
          call_time: string
          caller_number: string
          created_at: string
          duration: number | null
          has_recording: boolean | null
          id: string
          phone_number_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          call_sid: string
          call_time?: string
          caller_number: string
          created_at?: string
          duration?: number | null
          has_recording?: boolean | null
          id?: string
          phone_number_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          call_sid?: string
          call_time?: string
          caller_number?: string
          created_at?: string
          duration?: number | null
          has_recording?: boolean | null
          id?: string
          phone_number_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      committees: {
        Row: {
          candidate_first_name: string | null
          candidate_last_name: string | null
          candidate_middle_initial: string | null
          candidate_suffix: string | null
          created_at: string
          id: string
          organization_name: string | null
          type: string
          user_id: string
        }
        Insert: {
          candidate_first_name?: string | null
          candidate_last_name?: string | null
          candidate_middle_initial?: string | null
          candidate_suffix?: string | null
          created_at?: string
          id?: string
          organization_name?: string | null
          type: string
          user_id: string
        }
        Update: {
          candidate_first_name?: string | null
          candidate_last_name?: string | null
          candidate_middle_initial?: string | null
          candidate_suffix?: string | null
          created_at?: string
          id?: string
          organization_name?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      phone_numbers: {
        Row: {
          capabilities: Json | null
          created_at: string
          friendly_name: string | null
          id: string
          phone_number: string
          status: string
          twilio_sid: string
          updated_at: string
          user_id: string
        }
        Insert: {
          capabilities?: Json | null
          created_at?: string
          friendly_name?: string | null
          id?: string
          phone_number: string
          status?: string
          twilio_sid: string
          updated_at?: string
          user_id: string
        }
        Update: {
          capabilities?: Json | null
          created_at?: string
          friendly_name?: string | null
          id?: string
          phone_number?: string
          status?: string
          twilio_sid?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_name: string
          price_id: string
          quantity: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name: string
          price_id: string
          quantity?: number
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_name?: string
          price_id?: string
          quantity?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voicemails: {
        Row: {
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          is_default: boolean | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          user_id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
