// Helper function to render rich text content from markdown-like string
export const renderRichContent = (content: { text: string } | null) => {
  if (!content || !content.text) {
    return '<p class="text-muted-foreground italic">No content available for this lesson.</p>'
  }

  // Basic markdown-like rendering for preview
  const text = content.text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(/__(.*?)__/g, "<u>$1</u>") // Underline
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="text-secondary-foreground">$1</code></pre>',
    ) // Code blocks
    .replace(/• (.*?)(?=\n|$)/g, "<li class='ml-4'>$1</li>") // Bullet points
    .replace(/(<li.*<\/li>)/s, "<ul class='list-disc list-inside space-y-1 my-2'>$1</ul>") // Wrap list items in ul
    .replace(/!\[([^\]]*)]$$(https?:\/\/[^\s)]+)$$/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg" />') // Images
    .replace(/\[Video]$$(https?:\/\/[^\s)]+)$$/g, '<video src="$1" controls class="max-w-full rounded-lg"></video>') // Videos
    .replace(/\n\n/g, "<br /><br />") // Double newline for paragraph break
    .replace(/\n/g, "<br />") // Single newline for line break

  // Drop unusable blob: URLs
  const sanitized = text.replace(/blob:[^)\\s]+/g, "/placeholder.svg?height=400&width=600")
  return sanitized
}
