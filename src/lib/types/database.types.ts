export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    nablaweb_vue: {
        Tables: {
            nabla_group_members: {
                Row: {
                    date_joined: string
                    group: string
                    is_active: boolean
                    member_role: string
                    order: number
                    user: string
                }
                Insert: {
                    date_joined?: string
                    group: string
                    is_active?: boolean
                    member_role?: string
                    order?: number
                    user: string
                }
                Update: {
                    date_joined?: string
                    group?: string
                    is_active?: boolean
                    member_role?: string
                    order?: number
                    user?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_group_members_group_fkey"
                        columns: ["group"]
                        isOneToOne: false
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_group_members_user_fkey"
                        columns: ["user"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_groups: {
                Row: {
                    about: string
                    date_began: string
                    group_photo: string
                    id: string
                    is_active: boolean
                    kind: Database["nablaweb_vue"]["Enums"]["group_kind"]
                    leader: string | null
                    leader_mail: string | null
                    logo: string
                    mail_list: string | null
                    name: string
                    trusted_member: string | null
                }
                Insert: {
                    about?: string
                    date_began?: string
                    group_photo?: string
                    id: string
                    is_active?: boolean
                    kind?: Database["nablaweb_vue"]["Enums"]["group_kind"]
                    leader?: string | null
                    leader_mail?: string | null
                    logo?: string
                    mail_list?: string | null
                    name: string
                    trusted_member?: string | null
                }
                Update: {
                    about?: string
                    date_began?: string
                    group_photo?: string
                    id?: string
                    is_active?: boolean
                    kind?: Database["nablaweb_vue"]["Enums"]["group_kind"]
                    leader?: string | null
                    leader_mail?: string | null
                    logo?: string
                    mail_list?: string | null
                    name?: string
                    trusted_member?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_groups_leader_fkey"
                        columns: ["leader"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                    {
                        foreignKeyName: "nabla_groups_trusted_member_fkey"
                        columns: ["trusted_member"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_users: {
                Row: {
                    about: string
                    birthday: string | null
                    class: Database["nablaweb_vue"]["Enums"]["class"]
                    first_name: string
                    first_name_last_name_username: string | null
                    is_active: boolean
                    last_name: string
                    list_email: string
                    ntnu_card_id: string | null
                    ntnu_email: string
                    profile_picture: string
                    public_email: string
                    supabase_id: string
                    username: string
                    website: string
                }
                Insert: {
                    about?: string
                    birthday?: string | null
                    class: Database["nablaweb_vue"]["Enums"]["class"]
                    first_name: string
                    first_name_last_name_username?: string | null
                    is_active?: boolean
                    last_name: string
                    list_email: string
                    ntnu_card_id?: string | null
                    ntnu_email: string
                    profile_picture?: string
                    public_email?: string
                    supabase_id: string
                    username: string
                    website?: string
                }
                Update: {
                    about?: string
                    birthday?: string | null
                    class?: Database["nablaweb_vue"]["Enums"]["class"]
                    first_name?: string
                    first_name_last_name_username?: string | null
                    is_active?: boolean
                    last_name?: string
                    list_email?: string
                    ntnu_card_id?: string | null
                    ntnu_email?: string
                    profile_picture?: string
                    public_email?: string
                    supabase_id?: string
                    username?: string
                    website?: string
                }
                Relationships: []
            }
            nabladmins: {
                Row: {
                    date: string
                    reason: string
                    user: string
                }
                Insert: {
                    date?: string
                    reason: string
                    user: string
                }
                Update: {
                    date?: string
                    reason?: string
                    user?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabladmins_user_fkey"
                        columns: ["user"]
                        isOneToOne: true
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            trusted_member_areas: {
                Row: {
                    area_mail: string | null
                    category: string
                    id: string
                    name: string
                    order: number
                }
                Insert: {
                    area_mail?: string | null
                    category: string
                    id: string
                    name: string
                    order?: number
                }
                Update: {
                    area_mail?: string | null
                    category?: string
                    id?: string
                    name?: string
                    order?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "trusted_member_areas_category_fkey"
                        columns: ["category"]
                        isOneToOne: false
                        referencedRelation: "trusted_member_categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trusted_member_assignments: {
                Row: {
                    area: string
                    order: number
                    user: string
                }
                Insert: {
                    area: string
                    order?: number
                    user: string
                }
                Update: {
                    area?: string
                    order?: number
                    user?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "trusted_member_assignments_area_fkey"
                        columns: ["area"]
                        isOneToOne: false
                        referencedRelation: "trusted_member_areas"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "trusted_member_assignments_user_fkey"
                        columns: ["user"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            trusted_member_categories: {
                Row: {
                    display_name: string
                    id: string
                    order: number
                }
                Insert: {
                    display_name: string
                    id: string
                    order?: number
                }
                Update: {
                    display_name?: string
                    id?: string
                    order?: number
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
            class:
                | "ortogonal"
                | "kull20"
                | "kull21"
                | "kull22"
                | "kull23"
                | "kull24"
                | "kull25"
            group_kind: "Committee" | "Interest group"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            [_ in never]: never
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
    nablaweb_vue: {
        Enums: {
            class: [
                "ortogonal",
                "kull20",
                "kull21",
                "kull22",
                "kull23",
                "kull24",
                "kull25",
            ],
            group_kind: ["Committee", "Interest group"],
        },
    },
    public: {
        Enums: {},
    },
} as const
