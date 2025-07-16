import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import CourseCard from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Award, Zap, Brain } from "lucide-react"
import Link from "next/link"

async function getCourses() {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching courses:", error)
    return []
  }

  return courses || []
}

function CoursesGrid({ courses }: { courses: any[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No courses available</h3>
        <p className="text-gray-500">Check back later for new courses!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export default async function HomePage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Master New Skills with
            <span className="text-primary block">CourseLogic</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover courses from expert instructors. Learn at your own pace with our engaging, interactive platform
            powered by AI.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for courses..."
                className="pl-10 pr-4 py-3 text-lg bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">AI-Powered Learning</h3>
              <p className="text-muted-foreground">AI chat support to help with Learning.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mx-auto mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Outcome-Focused Learning</h3>
              <p className="text-muted-foreground">
                Practical, outcome-focused learning designed to help build skills fast.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-lg mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Free Courses</h3>
              <p className="text-muted-foreground">Free Introductory Courses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Courses</h2>
            <Button
              variant="outline"
              asChild
              className="border-border text-muted-foreground hover:bg-accent bg-transparent"
            >
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            }
          >
            <CoursesGrid courses={courses} />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose CourseLogic?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide the best learning experience with cutting-edge technology and expert instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Learning</h3>
              <p className="text-muted-foreground">AI chat support to help with Learning.</p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary rounded-full mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Outcome-Focused Learning</h3>
              <p className="text-muted-foreground">
                Practical, outcome-focused learning designed to help build skills fast.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Free Courses</h3>
              <p className="text-muted-foreground">Free Introductory Courses.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
