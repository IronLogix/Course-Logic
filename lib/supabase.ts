import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "student" | "admin"
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "student" | "admin"
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "student" | "admin"
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          price: number
          is_free: boolean
          is_published: boolean
          instructor_id: string | null
          category: string | null
          duration_hours: number | null
          level: "beginner" | "intermediate" | "advanced" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          price?: number
          is_free?: boolean
          is_published?: boolean
          instructor_id?: string | null
          category?: string | null
          duration_hours?: number | null
          level?: "beginner" | "intermediate" | "advanced" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          price?: number
          is_free?: boolean
          is_published?: boolean
          instructor_id?: string | null
          category?: string | null
          duration_hours?: number | null
          level?: "beginner" | "intermediate" | "advanced" | null
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order_index?: number | null
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          module_id: string
          title: string
          content: any | null
          video_url: string | null
          order_index: number | null
          duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          module_id: string
          title: string
          content?: any | null
          video_url?: string | null
          order_index?: number | null
          duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          module_id?: string
          title?: string
          content?: any | null
          video_url?: string | null
          order_index?: number | null
          duration_minutes?: number | null
          created_at?: string
        }
      }
      course_media: {
        Row: {
          id: string
          course_id: string
          lesson_id: string | null
          media_type: "image" | "video" | "document"
          media_url: string
          media_name: string | null
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          lesson_id?: string | null
          media_type: "image" | "video" | "document"
          media_url: string
          media_name?: string | null
          file_size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          lesson_id?: string | null
          media_type?: "image" | "video" | "document"
          media_url?: string
          media_name?: string | null
          file_size?: number | null
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress: number
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress?: number
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress?: number
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
        }
      }
    }
  }
}
