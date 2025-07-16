"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Loader2, Upload, ImageIcon } from "lucide-react"
import { CoursePreview, type ModuleDraft, type LessonDraft } from "@/components/course-preview"
import RichTextEditor from "@/components/rich-text-editor"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid" // Import uuid for client-side UUID generation

interface CourseFormState {
  title: string
  description: string
  price: number
  is_free: boolean
  is_published: boolean
  category: string
  level: string
  duration_hours: number
  thumbnail_url: string | null // Added thumbnail_url to state
}

export default function CreateCoursePage() {
  const [courseData, setCourseData] = useState<CourseFormState>({
    title: "",
    description: "",
    price: 0,
    is_free: false,
    is_published: false,
    category: "",
    level: "",
    duration_hours: 0,
    thumbnail_url: null, // Initialize thumbnail_url
  })
  const [modules, setModules] = useState<ModuleDraft[]>([])
  const [activeTab, setActiveTab] = useState("details")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  const handleCourseDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setCourseData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleModuleChange = (index: number, field: keyof ModuleDraft, value: string) => {
    const newModules = [...modules]
    newModules[index] = { ...newModules[index], [field]: value }
    setModules(newModules)
  }

  const addModule = () => {
    setModules((prev) => [...prev, { title: "", description: "", lessons: [] }])
  }

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index))
  }

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof LessonDraft, value: any) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons[lessonIndex] = { ...newModules[moduleIndex].lessons[lessonIndex], [field]: value }
    setModules(newModules)
  }

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons.push({ title: "", duration_minutes: 0, content: "" })
    setModules(newModules)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules]
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
    setModules(newModules)
  }

  const handleThumbnailSelect = () => {
    thumbnailInputRef.current?.click()
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingThumbnail(true)
    setError(null)
    setSuccess(null)

    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`
    const filePath = `course_thumbnails/${fileName}`

    try {
      const { data, error: uploadError } = await supabase.storage.from("course_media").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage.from("course_media").getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        setCourseData((prev) => ({ ...prev, thumbnail_url: publicUrlData.publicUrl }))
        setSuccess("Thumbnail uploaded successfully!")
      } else {
        throw new Error("Failed to get public URL for thumbnail.")
      }
    } catch (error: any) {
      console.error("Error uploading thumbnail:", error.message)
      setError("Thumbnail upload failed: " + error.message)
    } finally {
      setUploadingThumbnail(false)
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = ""
      }
    }
  }

  const generateCourseContent = async () => {
    setIsGenerating(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: courseData.description || courseData.title }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate course content.")
      }

      const aiData: any = await response.json()

      // The API might return `{ course: {...}, modules: [...] }`
      // OR it might return everything at the top level.  Handle both cases.
      const courseObj = aiData.course ?? aiData
      const generatedModules: ModuleDraft[] = Array.isArray(aiData.modules)
        ? aiData.modules
        : Array.isArray(courseObj.modules)
          ? courseObj.modules
          : []

      // Defensive helpers to coerce values
      const safeString = (v: any, d = "") => (typeof v === "string" ? v : d)
      const safeNum = (v: any, d = 0) => (Number.is.Finite(v) ? Number(v) : d)

      setCourseData((prev) => ({
        ...prev,
        title: safeString(courseObj.title, prev.title),
        description: safeString(courseObj.description, prev.description),
        category: safeString(courseObj.category, prev.category),
        level: safeString(courseObj.level, prev.level),
        duration_hours: safeNum(courseObj.duration_hours, prev.duration_hours),
      }))
      setModules(generatedModules)
      setSuccess("Course content generated successfully!")
      setActiveTab("content") // Switch to content tab to review
    } catch (err: any) {
      console.error("Error generating course:", err)
      setError(err.message || "Failed to generate course content.")
    } finally {
      setIsGenerating(false)
    }
  }

  const createCourse = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Generate UUIDs on the client side
      const courseId = uuidv4()
      const moduleIds = modules.map(() => uuidv4())
      const lessonIds = modules.map((mod) => mod.lessons.map(() => uuidv4()))

      // Insert course
      const { data: courseInsertData, error: courseError } = await supabase
        .from("courses")
        .insert({
          id: courseId,
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          is_free: courseData.is_free,
          is_published: courseData.is_published,
          category: courseData.category,
          level: courseData.level,
          duration_hours: courseData.duration_hours,
          thumbnail_url: courseData.thumbnail_url, // Include thumbnail_url
        })
        .select("id")
        .single()

      if (courseError || !courseInsertData) {
        throw courseError || new Error("Failed to insert course and retrieve ID.")
      }

      // ---------- Insert modules ----------
      const modulesToInsert = modules.map((mod, modIndex) => ({
        id: moduleIds[modIndex],
        course_id: courseId,
        title: mod.title.trim() || `Module ${modIndex + 1}`,
        description: mod.description,
        order_index: modIndex,
      }))

      const { error: modulesError } = await supabase.from("modules").insert(modulesToInsert)
      if (modulesError) {
        throw modulesError
      }

      // ---------- Insert lessons ----------
      const lessonsToInsert: any[] = []
      modules.forEach((mod, modIndex) => {
        mod.lessons.forEach((lesson, lessonIndex) => {
          lessonsToInsert.push({
            id: lessonIds[modIndex][lessonIndex],
            module_id: moduleIds[modIndex],
            course_id: courseId,
            title: lesson.title.trim() || `Lesson ${lessonIndex + 1}`,
            content: { text: lesson.content },
            duration_minutes: lesson.duration_minutes,
            order_index: lessonIndex,
          })
        })
      })

      if (lessonsToInsert.length) {
        const { error: lessonsError } = await supabase.from("lessons").insert(lessonsToInsert)
        if (lessonsError) {
          throw lessonsError
        }
      }

      setSuccess("Course created successfully!")
      router.push("/admin")
    } catch (err: any) {
      console.error("Error creating course:", JSON.stringify(err, null, 2))
      setError(err.message || "Failed to create course.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Create New Course</h1>

        {error && <div className="mb-4 text-destructive-foreground bg-destructive/20 p-3 rounded-md">{error}</div>}
        {success && <div className="mb-4 text-secondary-foreground bg-secondary/20 p-3 rounded-md">{success}</div>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={handleCourseDataChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Course Description
                  </Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={handleCourseDataChange}
                    className="bg-input text-foreground min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url" className="text-foreground">
                    Course Thumbnail Image
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="thumbnail_url"
                      type="file"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      onClick={handleThumbnailSelect}
                      disabled={uploadingThumbnail}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      {uploadingThumbnail ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload Thumbnail
                    </Button>
                    {courseData.thumbnail_url && (
                      <a
                        href={courseData.thumbnail_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <ImageIcon className="h-4 w-4 mr-1" /> View Current
                      </a>
                    )}
                  </div>
                  {courseData.thumbnail_url && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Current thumbnail: {courseData.thumbnail_url.split("/").pop()}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseData.price}
                      onChange={handleCourseDataChange}
                      className="bg-input text-foreground"
                      disabled={courseData.is_free}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={courseData.category}
                      onChange={handleCourseDataChange}
                      className="bg-input text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-foreground">
                      Level
                    </Label>
                    <Input
                      id="level"
                      value={courseData.level}
                      onChange={handleCourseDataChange}
                      className="bg-input text-foreground"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_hours" className="text-foreground">
                      Duration (hours)
                    </Label>
                    <Input
                      id="duration_hours"
                      type="number"
                      value={courseData.duration_hours}
                      onChange={handleCourseDataChange}
                      className="bg-input text-foreground"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id="is_free"
                      checked={courseData.is_free}
                      onCheckedChange={(checked) =>
                        setCourseData((prev) => ({
                          ...prev,
                          is_free: Boolean(checked),
                          price: checked ? 0 : prev.price,
                        }))
                      }
                    />
                    <Label htmlFor="is_free" className="text-foreground">
                      Free Course
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_published"
                    checked={courseData.is_published}
                    onCheckedChange={(checked) =>
                      setCourseData((prev) => ({ ...prev, is_published: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="is_published" className="text-foreground">
                    Publish Course
                  </Label>
                </div>
                <Button
                  onClick={generateCourseContent}
                  disabled={isGenerating || !courseData.title || !courseData.description}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Course Content with AI"
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  *To "tweak" the AI-generated content, modify the course title/description and click "Generate Course
                  Content with AI" again.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Course Modules & Lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {modules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No modules added yet. Click "Add Module" to start structuring your course.
                  </div>
                )}
                {modules.map((module, moduleIndex) => (
                  <Card key={moduleIndex} className="bg-muted border-border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Module {moduleIndex + 1}</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeModule(moduleIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`module-title-${moduleIndex}`} className="text-foreground">
                        Module Title
                      </Label>
                      <Input
                        id={`module-title-${moduleIndex}`}
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
                        className="bg-input text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`module-description-${moduleIndex}`} className="text-foreground">
                        Module Description
                      </Label>
                      <Textarea
                        id={`module-description-${moduleIndex}`}
                        value={module.description}
                        onChange={(e) => handleModuleChange(moduleIndex, "description", e.target.value)}
                        className="bg-input text-foreground min-h-[80px]"
                      />
                    </div>

                    <h4 className="text-md font-medium text-foreground mt-4">Lessons:</h4>
                    <div className="space-y-3 pl-4">
                      {module.lessons.length === 0 && (
                        <p className="text-sm text-muted-foreground">No lessons in this module yet.</p>
                      )}
                      {module.lessons.map((lesson, lessonIndex) => (
                        <Card key={lessonIndex} className="bg-card border-border p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-base font-medium text-foreground">Lesson {lessonIndex + 1}</h5>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`lesson-title-${moduleIndex}-${lessonIndex}`} className="text-foreground">
                              Lesson Title
                            </Label>
                            <Input
                              id={`lesson-title-${moduleIndex}-${lessonIndex}`}
                              value={lesson.title}
                              onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)}
                              className="bg-input text-foreground"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`lesson-duration-${moduleIndex}-${lessonIndex}`}
                              className="text-foreground"
                            >
                              Duration (minutes)
                            </Label>
                            <Input
                              id={`lesson-duration-${moduleIndex}-${lessonIndex}`}
                              type="number"
                              value={lesson.duration_minutes}
                              onChange={(e) =>
                                handleLessonChange(moduleIndex, lessonIndex, "duration_minutes", Number(e.target.value))
                              }
                              className="bg-input text-foreground"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`lesson-content-${moduleIndex}-${lessonIndex}`} className="text-foreground">
                              Lesson Content
                            </Label>
                            <RichTextEditor
                              id={`lesson-content-${moduleIndex}-${lessonIndex}`}
                              value={lesson.content}
                              onChange={(value) => handleLessonChange(moduleIndex, lessonIndex, "content", value)}
                              placeholder="Write your lesson content here..."
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      variant="outline"
                      className="w-full border-border text-muted-foreground hover:bg-accent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </Card>
                ))}
                <Button type="button" onClick={addModule} className="w-full bg-secondary hover:bg-secondary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <CoursePreview courseData={courseData} modules={modules} />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={createCourse} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Course...
              </>
            ) : (
              "Save Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
