import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

/* -------------------------------------------------------------------------- */
/* Schema Definition                                                          */
/* -------------------------------------------------------------------------- */

// Define the Zod schema for the expected course structure
const courseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  category: z.enum(["Web Development", "Data Science", "Design", "Business", "Marketing", "Programming", "Other"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration_hours: z.number().int().min(1).max(100),
  price: z.number().min(0).max(1000),
  is_free: z.boolean(),
  modules: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(500),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1).max(100),
              content: z.string().min(1),
              duration_minutes: z.number().int().min(1).max(300),
            }),
          )
          .min(3)
          .max(4),
      }),
    )
    .min(4)
    .max(5),
})

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Extremely small but valid fallback course so the editor loads. */
function buildFallbackCourse(prompt: string) {
  return {
    title: "Untitled Course (AI Fallback)",
    description:
      "AI was temporarily unavailable, so this minimal course was generated as a placeholder. Edit freely or try generating again later.",
    category: "Other",
    level: "beginner",
    duration_hours: 1,
    price: 0,
    is_free: true,
    modules: [
      {
        title: "Module 1: Getting Started",
        description: "Kick-off module.",
        lessons: [
          {
            title: "Lesson 1: Overview",
            duration_minutes: 30,
            content:
              "Replace this placeholder with real content. When AI becomes available, you can regenerate or refine with the AI assistant.",
          },
        ],
      },
    ],
  }
}

/* -------------------------------------------------------------------------- */
/* Route handler                                                              */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const { prompt } = (await request.json()) as { prompt: string }

    try {
      const { object: aiGeneratedContent } = await generateObject({
        model: google("models/gemini-1.5-flash-latest"),
        schema: courseSchema,
        prompt: prompt,
        temperature: 0.7,
        maxRetries: 5,
        system: `You are a highly skilled AI course content generator, specializing in creating **detailed, simple, and engaging** educational materials. Your task is to create a comprehensive course outline and detailed lesson content based on the user's prompt. You MUST generate a course title, description, category, level, estimated total duration, price, and whether it's free. Ensure the output strictly adheres to the provided JSON schema. Use markdown-like formatting for lesson content (e.g., **bold**, *italic*, __underline__, bullet points with '• ', and code blocks with \`\`\`lang
code
\`\`\`).

For Python courses, ensure a strong focus on fundamental concepts, including **thorough explanations of each Python variable type (e.g., integers, floats, strings, booleans, lists, dictionaries, tuples, sets) with clear examples and practical applications.**

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:
- Generate a **complete and ready-to-use course**. Do not output placeholders or instructions for the user to fill in content. Every field must be fully populated.
- Aim for a comprehensive course structure: **5 modules**, with **4 lessons in each module**, resulting in a total of **20 lessons**.
- Each lesson should be **45-60 minutes** long to allow for in-depth explanations.
- The course description should be 2-3 sentences.
- The estimated total duration should be **15-25 hours** based on content volume.
- For price, if the course is free, set price to 0 and is_free to true. Otherwise, set a realistic price and is_free to false.
`,
      })

      return NextResponse.json(aiGeneratedContent)
    } catch (err: any) {
      let errorMessage = "AI generation failed after retries."
      let rawErrorDetails = String(err)

      if (err instanceof z.ZodError) {
        errorMessage =
          "AI response did not match schema. Validation errors: " +
          err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
        rawErrorDetails = JSON.stringify(err.errors, null, 2)
      } else if (err.message) {
        errorMessage = err.message
      }

      console.warn(errorMessage, err)
      const fallback = buildFallbackCourse(prompt)
      return NextResponse.json({ fallback, rawError: rawErrorDetails })
    }
  } catch (err) {
    console.error("Fatal error in generate-course route:", err)
    return NextResponse.json({ error: "Unable to generate course content.", rawError: String(err) }, { status: 502 })
  }
}
