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
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_groups_leader_fkey"
                        columns: ["leader"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
