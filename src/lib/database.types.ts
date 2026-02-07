export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            debates: {
                Row: {
                    id: string
                    topic: string
                    description: string | null
                    option_a: string
                    option_b: string
                    status: 'active' | 'closed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    topic: string
                    description?: string | null
                    option_a?: string
                    option_b?: string
                    status?: 'active' | 'closed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    topic?: string
                    description?: string | null
                    option_a?: string
                    option_b?: string
                    status?: 'active' | 'closed'
                    created_at?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    argument_id: string
                    user_id: string
                    content: string
                    like_count: number
                    image_urls: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    argument_id: string
                    user_id: string
                    content: string
                    image_urls?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    argument_id?: string
                    user_id?: string
                    content?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "comments_argument_id_fkey"
                        columns: ["argument_id"]
                        referencedRelation: "arguments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            notices: {
                Row: {
                    id: string
                    title: string
                    content: string
                    created_at: string
                    like_count: number
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    created_at?: string
                    like_count?: number
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    created_at?: string
                    like_count?: number
                }
                Relationships: []
            }
            notice_comments: {
                Row: {
                    id: string
                    notice_id: string
                    user_id: string
                    content: string
                    like_count: number
                    image_urls: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    notice_id: string
                    user_id: string
                    content: string
                    like_count?: number
                    image_urls?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    notice_id?: string
                    user_id?: string
                    content?: string
                    like_count?: number
                    image_urls?: string[] | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "notice_comments_notice_id_fkey"
                        columns: ["notice_id"]
                        referencedRelation: "notices"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "notice_comments_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            notice_likes: {
                Row: {
                    user_id: string
                    notice_id: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    notice_id: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    notice_id?: string
                    created_at?: string
                }
            }
            notice_comment_likes: {
                Row: {
                    user_id: string
                    comment_id: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    comment_id: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    comment_id?: string
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    total_score: number
                    argument_count: number
                    role: 'user' | 'admin'
                    created_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    total_score?: number
                    argument_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    total_score?: number
                    argument_count?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            arguments: {
                Row: {
                    id: string
                    debate_id: string
                    user_id: string
                    side: 'pro' | 'con'
                    content: string
                    like_count: number
                    image_urls: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    debate_id: string
                    user_id: string
                    side: 'pro' | 'con'
                    content: string
                    image_urls?: string[] | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    debate_id?: string
                    user_id?: string
                    side?: 'pro' | 'con'
                    content?: string
                    created_at?: string
                }
            }
            argument_likes: {
                Row: {
                    user_id: string
                    argument_id: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    argument_id: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    argument_id?: string
                    created_at?: string
                }
            }
            comment_likes: {
                Row: {
                    user_id: string
                    comment_id: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    comment_id: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    comment_id?: string
                    created_at?: string
                }
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
    }
}

// Helper types for easy access
export type Debate = Database['public']['Tables']['debates']['Row']
export type Argument = Database['public']['Tables']['arguments']['Row']

export type NewArgument = Database['public']['Tables']['arguments']['Insert']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type NewDebate = Database['public']['Tables']['debates']['Insert']
export type Comment = Database['public']['Tables']['comments']['Row']
export type NewComment = Database['public']['Tables']['comments']['Insert']
export type Notice = Database['public']['Tables']['notices']['Row']
export type NoticeComment = Database['public']['Tables']['notice_comments']['Row']
