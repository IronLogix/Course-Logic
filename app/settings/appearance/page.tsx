"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Palette, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(theme)

  useEffect(() => {
    setSelectedTheme(theme)
  }, [theme])

  const themes = [
    {
      name: "Light Default",
      value: "light-default",
      colors: { bg: "hsl(0 0% 100%)", primary: "hsl(221.2 83.2% 53.3%)", text: "hsl(222.2 84% 4.9%)" },
    },
    {
      name: "Light Blue",
      value: "light-blue",
      colors: { bg: "hsl(200 100% 98%)", primary: "hsl(220 80% 50%)", text: "hsl(210 50% 20%)" },
    },
    {
      name: "Light Green",
      value: "light-green",
      colors: { bg: "hsl(100 100% 98%)", primary: "hsl(140 80% 40%)", text: "hsl(120 50% 20%)" },
    },
    {
      name: "Light Purple",
      value: "light-purple",
      colors: { bg: "hsl(280 100% 98%)", primary: "hsl(270 80% 50%)", text: "hsl(270 50% 20%)" },
    },
    {
      name: "Dark Blue", // Renamed from Dark Default
      value: "dark-blue", // Corresponds to the renamed theme in globals.css
      colors: { bg: "hsl(222.2 84% 4.9%)", primary: "hsl(217.2 91.2% 59.8%)", text: "hsl(210 20% 98%)" },
    },
    {
      name: "Dark Red",
      value: "dark-red",
      colors: { bg: "hsl(350 80% 10%)", primary: "hsl(0 80% 50%)", text: "hsl(0 0% 95%)" },
    },
    {
      name: "Dark Gold",
      value: "dark-gold",
      colors: { bg: "hsl(40 80% 10%)", primary: "hsl(40 80% 50%)", text: "hsl(40 0% 95%)" },
    },
    {
      name: "Dark Contrast (Default)", // Updated name
      value: "dark-contrast",
      colors: { bg: "hsl(0 0% 0%)", primary: "hsl(45 100% 50%)", text: "hsl(45 100% 70%)" },
    },
  ]

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value)
    setTheme(value)
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="border-border text-foreground bg-card hover:bg-accent">
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Appearance Settings</h1>
              <p className="text-muted-foreground mt-1">Customize the look and feel of your CourseLogic experience.</p>
            </div>
          </div>
        </div>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              UI Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedTheme}
              onValueChange={handleThemeChange}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {themes.map((t) => (
                <div key={t.value}>
                  <RadioGroupItem value={t.value} id={`theme-${t.value}`} className="sr-only" />
                  <Label
                    htmlFor={`theme-${t.value}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:border-primary"
                  >
                    <div
                      className="w-full h-24 rounded-md border border-border mb-3 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: t.colors.bg }}
                    >
                      <div
                        className="absolute top-2 left-2 w-6 h-6 rounded-full"
                        style={{ backgroundColor: t.colors.primary }}
                      ></div>
                      <div
                        className="absolute bottom-2 right-2 w-12 h-4 rounded-sm"
                        style={{ backgroundColor: t.colors.secondary }}
                      ></div>
                      <span className="text-sm font-medium" style={{ color: t.colors.text }}>
                        Aa
                      </span>
                      {selectedTheme === t.value && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <Check className="h-6 w-6 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{t.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
