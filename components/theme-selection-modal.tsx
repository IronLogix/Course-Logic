"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface ThemeSelectionModalProps {
  open: boolean
  onClose: () => void
}

/* -------------------------------------------------------------------- */
/* The eight palette IDs – MUST match the names used in globals.css     */
const THEMES = [
  { id: "dark-contrast", label: "Dark Contrast (Default)" },
  { id: "dark-blue", label: "Dark Blue" },
  { id: "dark-red", label: "Dark Red" },
  { id: "dark-gold", label: "Dark Gold" },
  { id: "light-default", label: "Light Default" },
  { id: "light-blue", label: "Light Blue" },
  { id: "light-green", label: "Light Green" },
  { id: "light-purple", label: "Light Purple" },
] as const
/* -------------------------------------------------------------------- */

const ThemeSelectionModal = ({ open, onClose }: ThemeSelectionModalProps) => {
  const { theme, setTheme } = useTheme()
  const [value, setValue] = useState<string>(theme ?? "dark-contrast")

  const handleSave = () => {
    setTheme(value)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select your preferred UI theme</DialogTitle>
        </DialogHeader>

        <RadioGroup value={value} onValueChange={setValue} className="grid grid-cols-2 gap-3 py-4">
          {THEMES.map(({ id, label }) => (
            <label
              key={id}
              htmlFor={id}
              className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted"
            >
              <RadioGroupItem value={id} id={id} />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button onClick={handleSave} className="w-full">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ThemeSelectionModal }
export default ThemeSelectionModal
