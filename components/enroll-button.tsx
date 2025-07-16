"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface EnrollButtonProps {
  courseId: string
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        checkEnrollment(user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkEnrollment(session.user.id)
      } else {
        setIsEnrolled(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [courseId])

  const checkEnrollment = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single()

      setIsEnrolled(!!data && !error)
    } catch (error) {
      console.error("Error checking enrollment:", error)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    setLoading(true)
    console.log("Attempting to enroll user:", user.id, "into course:", courseId)

    try {
      // ❶ Try an idempotent insert – Supabase will skip if the row already exists
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, course_id: courseId }, { ignoreDuplicates: true })

      // ❷ If a duplicate error still bubbles up, treat it as already enrolled
      if (error) {
        const isDuplicate =
          error.code === "23505" || /duplicate key value violates unique constraint/i.test(error.message)

        if (!isDuplicate) {
          console.error("Error enrolling:", error)
          alert("Enrollment failed: " + error.message)
          return
        }
      }

      // Either a brand-new row was inserted, or it already existed ➜ continue
      setIsEnrolled(true)
      router.push(`/learn/${courseId}`)
    } catch (err) {
      console.error("Error enrolling:", err)
      alert("Enrollment failed: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push(`/learn/${courseId}`)
  }

  if (isEnrolled) {
    return (
      <Button onClick={handleContinue} className="w-full bg-secondary hover:bg-secondary/90">
        Continue Learning
      </Button>
    )
  }

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
      {loading ? "Enrolling..." : "Enroll Now"}
    </Button>
  )
}
