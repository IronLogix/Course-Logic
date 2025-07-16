"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserIcon } from "lucide-react" // Import User icon

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        await getProfile(currentUser)
      } else if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        router.push("/auth/signin")
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getProfile = async (currentUser: User) => {
    try {
      const { data, error, status } = await supabase
        .from("users")
        .select(`full_name, username, avatar_url`)
        .eq("id", currentUser.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
        setUsername(data.username || "")
        setAvatarUrl(data.avatar_url)
      }
    } catch (error: any) {
      console.error("Error loading user profile:", error.message)
      setError("Failed to load profile: " + error.message)
    }
  }

  const updateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    if (!user) {
      setError("No user logged in.")
      setIsUpdating(false)
      return
    }

    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        username,
        avatar_url: avatarUrl, // Keep existing avatar_url if not changed
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("users").upsert(updates)

      if (error) {
        throw error
      }

      setSuccess("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error.message)
      setError("Failed to update profile: " + error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const getAvatarFallback = (name: string | null | undefined) => {
    if (!name) return <UserIcon className="h-6 w-6" />
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Not logged in</h3>
            <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
            <Button onClick={() => router.push("/auth/signin")} variant="outline">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-destructive/20 border-destructive/50">
                <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-secondary/20 border-secondary/50">
                <AlertDescription className="text-secondary-foreground">{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="User Avatar" />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                      {getAvatarFallback(fullName || user.email)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-muted-foreground text-sm">Avatar is the first letter of your name/email.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input id="email" type="email" value={user.email} disabled className="bg-muted text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-input text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-input text-foreground"
                />
              </div>

              <Button type="submit" disabled={isUpdating} className="w-full bg-primary hover:bg-primary/90">
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
