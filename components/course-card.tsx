import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string | null
    thumbnail_url: string | null
    price: number
    is_free: boolean
    category: string | null
    duration_hours: number | null
    level: "beginner" | "intermediate" | "advanced" | null
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary transition-colors group">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail_url || "/placeholder.svg?height=200&width=300"}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.is_free && <Badge className="absolute top-2 left-2 bg-secondary hover:bg-secondary/90">Free</Badge>}
          {course.level && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-background/80 text-foreground">
              {course.level}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              {course.duration_hours && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_hours}h</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>New</span>
              </div>
            </div>
          </div>

          {course.category && (
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              {course.category}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-lg font-bold text-foreground">{course.is_free ? "Free" : `$${course.price}`}</div>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
