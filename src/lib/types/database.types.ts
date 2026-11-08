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
            nabla_classes: {
                Row: {
                    class: string
                    id: string
                }
                ComputedFields: never
                Insert: {
                    class?: string
                    id: string
                }
                Update: {
                    class?: string
                    id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_classes_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nabla_events: {
                Row: {
                    created_at: string
                    en_body_text: string
                    en_description: string
                    en_title: string
                    end_time: string
                    event_photo_url: string
                    event_type: Database["nablaweb_vue"]["Enums"]["event_type"]
                    is_hidden: boolean
                    location: string
                    nb_body_text: string
                    nb_description: string
                    nb_title: string
                    nn_body_text: string
                    nn_description: string
                    nn_title: string
                    organiser: string
                    registration_required: boolean
                    slug: string
                    start_time: string
                    total_registration_limit: number
                }
                ComputedFields: never
                Insert: {
                    created_at?: string
                    en_body_text?: string
                    en_description?: string
                    en_title?: string
                    end_time: string
                    event_photo_url?: string
                    event_type?: Database["nablaweb_vue"]["Enums"]["event_type"]
                    is_hidden?: boolean
                    location?: string
                    nb_body_text?: string
                    nb_description?: string
                    nb_title?: string
                    nn_body_text?: string
                    nn_description?: string
                    nn_title?: string
                    organiser: string
                    registration_required?: boolean
                    slug: string
                    start_time: string
                    total_registration_limit?: number
                }
                Update: {
                    created_at?: string
                    en_body_text?: string
                    en_description?: string
                    en_title?: string
                    end_time?: string
                    event_photo_url?: string
                    event_type?: Database["nablaweb_vue"]["Enums"]["event_type"]
                    is_hidden?: boolean
                    location?: string
                    nb_body_text?: string
                    nb_description?: string
                    nb_title?: string
                    nn_body_text?: string
                    nn_description?: string
                    nn_title?: string
                    organiser?: string
                    registration_required?: boolean
                    slug?: string
                    start_time?: string
                    total_registration_limit?: number
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
                ComputedFields: never
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
                ComputedFields: never
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
                        referencedColumns: ["slug"]
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
                ComputedFields: never
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
                        referencedColumns: ["slug"]
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
                ComputedFields: never
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
                        referencedColumns: ["slug"]
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
                    quota: string | null
                    registered_at: string
                    status: Database["nablaweb_vue"]["Enums"]["participant_status"]
                    username: string
                }
                ComputedFields: never
                Insert: {
                    event: string
                    quota?: string | null
                    registered_at?: string
                    status?: Database["nablaweb_vue"]["Enums"]["participant_status"]
                    username: string
                }
                Update: {
                    event?: string
                    quota?: string | null
                    registered_at?: string
                    status?: Database["nablaweb_vue"]["Enums"]["participant_status"]
                    username?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_participants_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["slug"]
                    },
                    {
                        foreignKeyName: "nabla_events_participants_quota_fkey"
                        columns: ["quota"]
                        isOneToOne: false
                        referencedRelation: "nabla_events_quotas"
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
            nabla_events_quotas: {
                Row: {
                    deregistration_end: string
                    event: string
                    id: string
                    nabla_group: string | null
                    nabla_group_capacity: number | null
                    payment_end: string | null
                    price_kr: number
                    registration_end: string
                    registration_start: string
                }
                ComputedFields: never
                Insert: {
                    deregistration_end?: string
                    event: string
                    id?: string
                    nabla_group?: string | null
                    nabla_group_capacity?: number | null
                    payment_end?: string | null
                    price_kr?: number
                    registration_end?: string
                    registration_start?: string
                }
                Update: {
                    deregistration_end?: string
                    event?: string
                    id?: string
                    nabla_group?: string | null
                    nabla_group_capacity?: number | null
                    payment_end?: string | null
                    price_kr?: number
                    registration_end?: string
                    registration_start?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_events_quotas_event_fkey"
                        columns: ["event"]
                        isOneToOne: false
                        referencedRelation: "nabla_events"
                        referencedColumns: ["slug"]
                    },
                    {
                        foreignKeyName: "nabla_events_quotas_nabla_group_fkey"
                        columns: ["nabla_group"]
                        isOneToOne: false
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nabla_events_reactions: {
                Row: {
                    event: string
                    reaction: string
                    username: string
                }
                ComputedFields: never
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
                        referencedColumns: ["slug"]
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
            nabla_group_members: {
                Row: {
                    date_joined: string
                    group: string
                    is_active: boolean
                    member_role: string
                    order: number
                    user: string
                }
                ComputedFields: never
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
                    date_began: string
                    id: string
                    is_active: boolean
                    mail_list: string | null
                    name: string
                }
                ComputedFields: never
                Insert: {
                    date_began?: string
                    id: string
                    is_active?: boolean
                    mail_list?: string | null
                    name: string
                }
                Update: {
                    date_began?: string
                    id?: string
                    is_active?: boolean
                    mail_list?: string | null
                    name?: string
                }
                Relationships: []
            }
            nabla_subgroups: {
                Row: {
                    about: string
                    group_photo: string
                    id: string
                    kind: Database["nablaweb_vue"]["Enums"]["group_kind"]
                    leader: string | null
                    leader_mail: string | null
                    logo: string
                    trusted_member: string | null
                }
                ComputedFields: never
                Insert: {
                    about?: string
                    group_photo?: string
                    id: string
                    kind?: Database["nablaweb_vue"]["Enums"]["group_kind"]
                    leader?: string | null
                    leader_mail?: string | null
                    logo?: string
                    trusted_member?: string | null
                }
                Update: {
                    about?: string
                    group_photo?: string
                    id?: string
                    kind?: Database["nablaweb_vue"]["Enums"]["group_kind"]
                    leader?: string | null
                    leader_mail?: string | null
                    logo?: string
                    trusted_member?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "nabla_subgroups_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "nabla_groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "nabla_subgroups_leader_fkey"
                        columns: ["leader"]
                        isOneToOne: false
                        referencedRelation: "nabla_users"
                        referencedColumns: ["username"]
                    },
                    {
                        foreignKeyName: "nabla_subgroups_trusted_member_fkey"
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
                ComputedFields: never
                Insert: {
                    about?: string
                    birthday?: string | null
                    first_name: string
                    first_name_last_name_username?: never
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
                    first_name?: string
                    first_name_last_name_username?: never
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
                ComputedFields: never
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
                ComputedFields: never
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
                ComputedFields: never
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
                ComputedFields: never
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
            cancel_registration: {
                Args: { p_event: string }
                Returns: undefined
            }
            register_for_event: {
                Args: { p_event: string }
                Returns: Database["nablaweb_vue"]["Enums"]["participant_status"]
            }
        }
        Enums: {
            event_type: "ordinary" | "bedpress" | "payment" | "undefined"
            group_kind: "Committee" | "Interest group"
            participant_status: "registered" | "waitlisted" | "cancelled"
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
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never) = never,
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
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never) = never,
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
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never) = never,
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
    EnumName extends (DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never) = never,
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
    CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never) = never,
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
            event_type: ["ordinary", "bedpress", "payment", "undefined"],
            group_kind: ["Committee", "Interest group"],
            participant_status: ["registered", "waitlisted", "cancelled"],
        },
    },
    public: {
        Enums: {},
    },
} as const
