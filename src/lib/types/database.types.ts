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
            nabla_events: {
                Row: {
                    created_at: string
                    end_time: string
                    event_photo: string
                    event_type: Database["nablaweb_vue"]["Enums"]["event_type"]
                    global_registration_limit: number
                    id: string
                    is_hidden: boolean
                    location: string
                    organiser: string
                    registration_required: boolean
                    slug: string
                    start_time: string
                }
                Insert: {
                    created_at?: string
                    end_time?: string
                    event_photo?: string
                    event_type?: Database["nablaweb_vue"]["Enums"]["event_type"]
                    global_registration_limit?: number
                    id?: string
                    is_hidden?: boolean
                    location?: string
                    organiser: string
                    registration_required?: boolean
                    slug: string
                    start_time?: string
                }
                Update: {
                    created_at?: string
                    end_time?: string
                    event_photo?: string
                    event_type?: Database["nablaweb_vue"]["Enums"]["event_type"]
                    global_registration_limit?: number
                    id?: string
                    is_hidden?: boolean
                    location?: string
                    organiser?: string
                    registration_required?: boolean
                    slug?: string
                    start_time?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_organiser_fkey"
                        columns: ["organiser"]
                        isOneToOne: false
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nabla_events_comment_reactions: {
                Row: {
                    comment: string
                    reaction: string
                    username: string
                }
                Insert: {
                    comment: string
                    reaction?: string
                    username: string
                }
                Update: {
                    comment?: string
                    reaction?: string
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_comment_reactions_comment_fkey"
                        columns: ["comment"]
                        isOneToOne: false
                        referencedRelation: "nabla_events_comments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_comment_reactions_username_fkey"
                        columns: ["username"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_events_comments: {
                Row: {
                    comment: string
                    created_at: string
                    event: string
                    id: string
                    username: string
                }
                Insert: {
                    comment?: string
                    created_at?: string
                    event: string
                    id?: string
                    username: string
                }
                Update: {
                    comment?: string
                    created_at?: string
                    event?: string
                    id?: string
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_comments_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_comments_username_fkey"
                        columns: ["username"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_events_owner_groups: {
                Row: {
                    event: string
                    organizing_group: string
                }
                Insert: {
                    event: string
                    organizing_group: string
                }
                Update: {
                    event?: string
                    organizing_group?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_owner_groups_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_owner_groups_organizing_group_fkey"
                        columns: ["organizing_group"]
                        isOneToOne: false
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nabla_events_owner_individuals: {
                Row: {
                    event: string
                    username: string
                }
                Insert: {
                    event: string
                    username: string
                }
                Update: {
                    event?: string
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_owner_individuals_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_owner_individuals_username_fkey"
                        columns: ["username"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_events_participants: {
                Row: {
                    event: string
                    is_registered: boolean
                    registered_at: string
                    username: string
                }
                Insert: {
                    event: string
                    is_registered?: boolean
                    registered_at?: string
                    username: string
                }
                Update: {
                    event?: string
                    is_registered?: boolean
                    registered_at?: string
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_participants_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_participants_username_fkey"
                        columns: ["username"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_events_reactions: {
                Row: {
                    event: string
                    reaction: string
                    username: string
                }
                Insert: {
                    event: string
                    reaction?: string
                    username: string
                }
                Update: {
                    event?: string
                    reaction?: string
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_reactions_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_reactions_username_fkey"
                        columns: ["username"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                ]
            }
            nabla_events_registrations: {
                Row: {
                    deregistration_end: string
                    event: string
                    group_price: string
                    id: string
                    payment_end: string
                    registering_group: string
                    registration_end: string
                    registration_start: string
                }
                Insert: {
                    deregistration_end?: string
                    event: string
                    group_price?: string
                    id?: string
                    payment_end?: string
                    registering_group: string
                    registration_end?: string
                    registration_start?: string
                }
                Update: {
                    deregistration_end?: string
                    event?: string
                    group_price?: string
                    id?: string
                    payment_end?: string
                    registering_group?: string
                    registration_end?: string
                    registration_start?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_registrations_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_events_registrations_registering_group_fkey"
                        columns: ["registering_group"]
                        isOneToOne: false
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nabla_events_translations: {
                Row: {
                    body_text: string
                    description: string
                    event: string
                    language: string
                    title: string
                }
                Insert: {
                    body_text?: string
                    description?: string
                    event: string
                    language: string
                    title?: string
                }
                Update: {
                    body_text?: string
                    description?: string
                    event?: string
                    language?: string
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_translations_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["id"]
                    },
                ]
            }
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
                    display_name: string
                    id: string
                    order: number
                }
                Insert: {
                    area_mail?: string | null
                    category: string
                    display_name: string
                    id: string
                    order?: number
                }
                Update: {
                    area_mail?: string | null
                    category?: string
                    display_name?: string
                    id?: string
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
                    area_id: string
                    order: number
                    username: string
                }
                Insert: {
                    area_id: string
                    order?: number
                    username: string
                }
                Update: {
                    area_id?: string
                    order?: number
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "trusted_member_assignments_area_id_fkey"
                        columns: ["area_id"]
                        isOneToOne: false
                        referencedRelation: "trusted_member_areas"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "trusted_member_assignments_username_fkey"
                        columns: ["username"]
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
            event_type: "ordinary" | "bedpress" | "payment" | "recurrent"
            group_kind: "Committee" | "Interest group"
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
            event_type: ["ordinary", "bedpress", "payment", "recurrent"],
            group_kind: ["Committee", "Interest group"],
        },
    },
} as const
