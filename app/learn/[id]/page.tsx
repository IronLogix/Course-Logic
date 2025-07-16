"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CheckCircle, Circle, BookOpen, Clock, Award, MessageCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { renderRichContent } from "@/lib/markdown-renderer"
import type { User } from "@supabase/supabase-js"

interface Lesson {
  id: string
  title: string
  content: { text: string } | null
  video_url: string | null
  order_index: number | null
  duration_minutes: number | null
}

interface Course {
  id: string
  title: string
  description: string | null
}

interface LessonProgress {
  lesson_id: string
  completed: boolean
}

export default function LearnPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [progress, setProgress] = useState<LessonProgress[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", currentUser.id)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
          setUserRole(null)
        } else {
          setUserRole(profile?.role || "student")
        }

        await checkEnrollmentAndLoadCourse(currentUser.id, profile?.role || "student")
      } else if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        router.push("/auth/signin")
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [params.id, router])

  const checkEnrollmentAndLoadCourse = async (userId: string, role: string) => {
    try {
      if (role === "admin") {
        console.log("Admin user detected, bypassing enrollment check.")
      } else {
        const { data: enrollment, error: enrollmentError } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", userId)
          .eq("course_id", params.id)
          .single()

        if (enrollmentError || !enrollment) {
          router.push(`/courses/${params.id}`)
          return
        }
      }

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("id, title, description")
        .eq("id", params.id)
        .single()

      if (courseError || !courseData) {
        router.push("/")
        return
      }

      setCourse(courseData)

      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", params.id)
        .order("order_index", { ascending: true })

      if (!lessonsError && lessonsData) {
        setLessons(lessonsData)
      }

      const { data: progressData, error: progressError } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", userId)

      if (!progressError && progressData) {
        setProgress(progressData)
      }
    } catch (error) {
      console.error("Error loading course:", error)
      router.push("/")
    }
  }

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      })

      if (!error) {
        setProgress((prev) => {
          const existing = prev.find((p) => p.lesson_id === lessonId)
          if (existing) {
            return prev.map((p) => (p.lesson_id === lessonId ? { ...p, completed: true } : p))
          } else {
            return [...prev, { lesson_id: lessonId, completed: true }]
          }
        })
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress.some((p) => p.lesson_id === lessonId && p.completed)
  }

  const getCompletionPercentage = () => {
    if (lessons.length === 0) return 0
    const completedCount = lessons.filter((lesson) => isLessonCompleted(lesson.id)).length
    return Math.round((completedCount / lessons.length) * 100)
  }

  const currentLesson = lessons[currentLessonIndex]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading course...</div>
      </div>
    )
  }

  if (!course || lessons.length === 0 || !currentLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No lessons available or course not found</h3>
            <p className="text-muted-foreground mb-4">
              This course doesn't have any lessons yet or could not be loaded.
            </p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Progress */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-8">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">{course.title}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">{getCompletionPercentage()}%</span>
                  </div>
                  <Progress value={getCompletionPercentage()} />
                  <Progress value={getCompletionPercentage()} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentLessonIndex
                        ? "bg-primary text-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/90"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isLessonCompleted(lesson.id) ? (
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                        {lesson.duration_minutes && (
                          <p className="text-xs text-muted-foreground">{lesson.duration_minutes} min</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground text-xl">{currentLesson.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        Lesson {currentLessonIndex + 1} of {lessons.length}
                      </Badge>
                      {currentLesson.duration_minutes && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{currentLesson.duration_minutes} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isLessonCompleted(currentLesson.id) && (
                      <Button
                        onClick={() => markLessonComplete(currentLesson.id)}
                        size="sm"
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    {isLessonCompleted(currentLesson.id) && (
                      <Badge className="bg-secondary hover:bg-secondary/90">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Player Placeholder */}
                {currentLesson.video_url ? (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Video Player: {currentLesson.video_url}</p>
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No video available for this lesson</p>
                    </div>
                  </div>
                )}

                <Separator className="bg-border" />

                {/* Lesson Content */}
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderRichContent(currentLesson.content) }}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                    disabled={currentLessonIndex === 0}
                    variant="outline"
                    className="border-border text-muted-foreground hover:bg-accent"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>

                  <div className="text-center">
                    {getCompletionPercentage() === 100 && (
                      <div className="flex items-center space-x-2 text-secondary">
                        <Award className="h-5 w-5" />
                        <span className="font-medium">Course Completed!</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => setCurrentLessonIndex(Math.min(lessons.length - 1, currentLessonIndex + 1))}
                    disabled={currentLessonIndex === lessons.length - 1}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Contact Support Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button asChild className="bg-secondary hover:bg-secondary/90">
          <Link href="/contact">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  )
}
