import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import CourseCard from "@/components/course-card"
import { BookOpen } from "lucide-react"

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
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No courses available</h3>
        <p className="text-muted-foreground">Check back later for new courses!</p>
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

export default async function AllCoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
                ))}
              </div>
            }
          >
            <CoursesGrid courses={courses} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
