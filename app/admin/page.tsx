"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Users, DollarSign, Edit, Trash2, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { Alert, AlertDescription } from "@/components/ui/alert" // Import Alert components

interface Course {
  id: string
  title: string
  description: string | null
  price: number
  is_free: boolean
  is_published: boolean
  category: string | null
  created_at: string
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // State for error messages
  const [success, setSuccess] = useState<string | null>(null) // State for success messages
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", currentUser.id).single()

        if (!profile || profile.role !== "admin") {
          router.push("/")
          return
        }

        setUserProfile(profile)
        await loadAdminData()
      } else if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        router.push("/auth/signin")
      }

      setLoading(false)
    })

    // cleanup
    return () => subscription.unsubscribe()
  }, [])

  const loadAdminData = async () => {
    setError(null)
    setSuccess(null)
    try {
      // Load courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })

      if (coursesError) {
        throw coursesError
      }
      if (coursesData) {
        setCourses(coursesData)

        // Calculate stats
        const totalCourses = coursesData.length
        const publishedCourses = coursesData.filter((c) => c.is_published).length

        setStats((prev) => ({
          ...prev,
          totalCourses,
          publishedCourses,
        }))
      }

      // Load enrollment stats
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id, course_id")

      if (enrollmentError) {
        throw enrollmentError
      }
      if (enrollmentData) {
        setStats((prev) => ({
          ...prev,
          totalStudents: enrollmentData.length,
        }))
      }
    } catch (err: any) {
      console.error("Error loading admin data:", err)
      setError(err.message || "Failed to load admin data.")
    }
  }

  const deleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete the course "${courseTitle}"? This action cannot be undone.`)) {
      return
    }

    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId)

      if (error) {
        throw error
      }

      setCourses((prev) => prev.filter((c) => c.id !== courseId))
      setSuccess(`Course "${courseTitle}" deleted successfully!`)
      await loadAdminData() // Reload stats after deletion
    } catch (err: any) {
      console.error("Error deleting course:", err)
      setError(err.message || "Failed to delete course.")
    }
  }

  const togglePublishStatus = async (courseId: string, currentStatus: boolean) => {
    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase.from("courses").update({ is_published: !currentStatus }).eq("id", courseId)

      if (error) {
        throw error
      }

      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, is_published: !currentStatus } : c)))
      setSuccess(`Course status updated to ${!currentStatus ? "Published" : "Draft"}!`)
    } catch (err: any) {
      console.error("Error updating course status:", err)
      setError(err.message || "Failed to update course status.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage courses and monitor platform performance</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/courses/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-destructive/20 border-destructive/50">
            <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 bg-secondary/20 border-secondary/50">
            <AlertDescription className="text-secondary-foreground">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Courses</p>
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
                  <p className="text-muted-foreground text-sm">Published</p>
                  <p className="text-2xl font-bold text-foreground">{stats.publishedCourses}</p>
                </div>
                <Eye className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">All Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course to get started.</p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/admin/courses/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Course</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Price</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Created</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b border-border/50">
                        <td className="py-4 px-4">
                          <div>
                            <h3 className="font-medium text-foreground">{course.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {course.category && (
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {course.category}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-foreground">{course.is_free ? "Free" : `$${course.price}`}</td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              course.is_published ? "bg-secondary hover:bg-secondary/90" : "bg-muted hover:bg-muted/90"
                            }
                          >
                            {course.is_published ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(course.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePublishStatus(course.id, course.is_published)}
                              className="border-border text-muted-foreground hover:bg-accent"
                            >
                              {course.is_published ? "Unpublish" : "Publish"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="border-border text-muted-foreground hover:bg-accent bg-transparent"
                            >
                              <Link href={`/admin/courses/${course.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCourse(course.id, course.title)}
                              className="border-destructive text-destructive-foreground hover:bg-destructive/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
