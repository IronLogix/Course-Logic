"use client"

import { useState, useCallback } from "react"
import { createEditor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

const RichTextEditor = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())))
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ])
  const supabase = useSupabaseClient()

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        const fileName = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage.from("course_media").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Error uploading image:", error)
          return null
        }

        const { data: publicUrlData } = supabase.storage.from("course_media").getPublicUrl(fileName)

        return publicUrlData.publicUrl
      } catch (error) {
        console.error("Unexpected error uploading image:", error)
        return null
      }
    },
    [supabase],
  )

  const moveImage = useCallback(
    async (oldPath: string, newPath: string) => {
      try {
        const { data, error } = await supabase.storage.from("course_media").move(oldPath, newPath)

        if (error) {
          console.error("Error moving image:", error)
          return null
        }

        return true
      } catch (error) {
        console.error("Unexpected error moving image:", error)
        return null
      }
    },
    [supabase],
  )

  return (
    <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
      <Editable />
    </Slate>
  )
}

export default RichTextEditor
