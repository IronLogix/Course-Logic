import { notFound } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Star, BookOpen, Play } from "lucide-react"
import EnrollButton from "@/components/enroll-button"

// Replace invalid (e.g. blob:) URLs with a placeholder the browser can fetch
function safeMediaUrl(url: string | null | undefined) {
  if (!url || url.startsWith("blob:")) {
    return "/placeholder.svg?height=400&width=600"
  }
  return url
}

async function getCourse(id: string) {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  if (error || !course) {
    return null
  }

  return course
}

async function getCourseLessons(courseId: string) {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching lessons:", error)
    return []
  }

  return lessons || []
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  const lessons = await getCourseLessons(course.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {course.category}
                </Badge>
                {course.level && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {course.level}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{course.title}</h1>

              <p className="text-lg text-muted-foreground">{course.description}</p>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                {course.duration_hours && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration_hours} hours</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span>New Course</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Be the first to enroll!</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={safeMediaUrl(course.thumbnail_url) || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Play className="h-5 w-5 mr-2" />
                  Preview Course
                </Button>
              </div>
            </div>

            {/* Course Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Course Content</h2>

              {lessons.length > 0 ? (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm text-muted-foreground">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{lesson.title}</h3>
                              {lesson.content && <p className="text-sm text-muted-foreground mt-1">{lesson.content}</p>}
                            </div>
                          </div>
                          {lesson.duration_minutes && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{lesson.duration_minutes}min</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">Course content coming soon</h3>
                    <p className="text-muted-foreground">Lessons will be available once you enroll.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="bg-card border-border sticky top-8">
              <CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {course.is_free ? "Free" : `$${course.price}`}
                  </div>
                  {!course.is_free && <p className="text-sm text-muted-foreground">One-time payment</p>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnrollButton courseId={course.id} />

                <Separator className="bg-border" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Full lifetime access</span>
                    <span>✓</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Certificate of completion</span>
                    <span>✓</span>
                  </div>
                  {/* Removed 30-day money-back guarantee */}
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Students Enrolled</span>
                  <span className="text-foreground font-medium">New Course</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Course Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-foreground font-medium">New</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="text-foreground font-medium">Be the first!</span>
                </div>
                {lessons.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Lessons</span>
                    <span className="text-foreground font-medium">{lessons.length}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
