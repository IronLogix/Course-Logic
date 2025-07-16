"use client"

import { Button } from "@/components/ui/button"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Star, BookOpen, Play, Info } from "lucide-react" // Added Info icon
import { renderRichContent } from "@/lib/markdown-renderer" // Import the new helper

export interface LessonDraft {
  title: string
  duration_minutes: number
  content: string // Added content for rich text preview
}

export interface ModuleDraft {
  title: string
  description: string
  lessons: LessonDraft[]
}

export interface CourseDraft {
  title: string
  description: string
  thumbnail_url?: string | null // Added thumbnail_url
  category?: string
  level?: string
  duration_hours?: number
  price?: number
  is_free?: boolean
}

export interface CoursePreviewProps {
  courseData: CourseDraft
  modules: ModuleDraft[]
}

/**
 * Basic, read-only preview of a draft course.
 * Used by `/admin/courses/create` before saving / publishing.
 */
const CoursePreview = ({ courseData, modules }: CoursePreviewProps) => {
  const totalLessons = modules.reduce((sum, mod) => sum + mod.lessons.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {courseData.category && (
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {courseData.category}
                  </Badge>
                )}
                {courseData.level && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {courseData.level}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {courseData.title || "Untitled Course"}
              </h1>

              <p className="text-lg text-muted-foreground">{courseData.description || "No description provided."}</p>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                {courseData.duration_hours && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{courseData.duration_hours} hours</span>
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
                src={courseData.thumbnail_url || "/placeholder.svg?height=400&width=600"}
                alt={courseData.title || "Course Thumbnail"}
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

            {/* Course Content (Modules & Lessons) */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Course Content</h2>

              {modules.length > 0 ? (
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.title + moduleIndex} className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        Module {moduleIndex + 1}: {module.title || "Untitled Module"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{module.description || "No description."}</p>
                      <div className="space-y-2 pl-4">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <Card key={lesson.title + lessonIndex} className="bg-card border-border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm text-muted-foreground">
                                    {lessonIndex + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-foreground">{lesson.title || "Untitled Lesson"}</h4>
                                    {lesson.content && (
                                      <div
                                        className="text-sm text-muted-foreground mt-1 line-clamp-2"
                                        dangerouslySetInnerHTML={{
                                          __html: renderRichContent({ text: lesson.content }),
                                        }}
                                      />
                                    )}
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
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No course content yet</h3>
                    <p className="text-muted-foreground">Add modules and lessons to see them here.</p>
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
                    {courseData.is_free ? "Free" : `$${courseData.price || 0}`}
                  </div>
                  {!courseData.is_free && <p className="text-sm text-muted-foreground">One-time payment</p>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled
                  title="This is a course preview. Enroll on the published course page."
                >
                  <Info className="h-4 w-4 mr-2" />
                  Enroll Now (Preview)
                </Button>

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
                {totalLessons > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Lessons</span>
                    <span className="text-foreground font-medium">{totalLessons}</span>
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

export { CoursePreview }
export default CoursePreview
