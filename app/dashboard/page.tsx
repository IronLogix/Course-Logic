"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, Play, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface EnrolledCourse {
  id: string
  course_id: string
  progress: number
  enrolled_at: string
  courses: {
    id: string
    title: string
    description: string | null
    thumbnail_url: string | null
    category: string | null
    duration_hours: number | null
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        await loadDashboardData(currentUser.id)
      } else if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        router.push("/auth/signin")
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadDashboardData = async (userId: string) => {
    try {
      // Load enrolled courses
      const { data: enrollments, error: enrollmentError } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses (
            id,
            title,
            description,
            thumbnail_url,
            category,
            duration_hours
          )
        `)
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false })

      if (!enrollmentError && enrollments) {
        setEnrolledCourses(enrollments)

        // Calculate stats
        const totalCourses = enrollments.length
        const completedCourses = enrollments.filter((e) => e.progress >= 100).length
        const totalHours = enrollments.reduce((sum, e) => sum + (e.courses.duration_hours || 0), 0)

        setStats({
          totalCourses,
          completedCourses,
          totalHours,
          certificates: completedCourses,
        })
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your learning progress and continue your courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completedCourses}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Learning Hours</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Certificates</p>
                  <p className="text-2xl font-bold text-foreground">{stats.certificates}</p>
                </div>
                <Award className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">My Courses</CardTitle>
              <Button asChild variant="outline" className="border-border text-muted-foreground bg-transparent">
                <Link href="/">Browse More Courses</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No courses enrolled yet</h3>
                <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course.</p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="bg-muted border-border hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg line-clamp-2">
                            {enrollment.courses.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                            {enrollment.courses.description}
                          </p>
                        </div>

                        {enrollment.courses.category && (
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {enrollment.courses.category}
                          </Badge>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground font-medium">{Math.round(enrollment.progress)}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {enrollment.courses.duration_hours && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{enrollment.courses.duration_hours}h</span>
                              </div>
                            )}
                            {enrollment.progress >= 100 && (
                              <div className="flex items-center space-x-1 text-secondary">
                                <Award className="h-4 w-4" />
                                <span>Completed</span>
                              </div>
                            )}
                          </div>
                          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                            <Link href={`/learn/${enrollment.course_id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              {enrollment.progress > 0 ? "Continue" : "Start"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
