"use client"

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Ban, CheckCircle, Trash2, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { suspendUser, unsuspendUser, terminateUser } from "@/lib/auth" // Import new auth functions
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: "student" | "admin"
  status: "active" | "suspended" // Added status
  created_at: string
}

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null) // To track loading state for specific user actions
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null
      setCurrentUser(user)

      if (user) {
        const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()
        if (!profile || profile.role !== "admin") {
          router.push("/") // Redirect if not admin
          return
        }
        await loadUserProfiles()
      } else if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        router.push("/auth/signin")
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfiles = async () => {
    setError(null)
    try {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      setUserProfiles(data as UserProfile[])
    } catch (err: any) {
      console.error("Error loading user profiles:", err)
      setError(err.message || "Failed to load user profiles.")
    }
  }

  const handleSuspend = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this account? The user will not be able to sign in.")) {
      return
    }
    setActionLoading(userId)
    setError(null)
    try {
      await suspendUser(userId)
      await loadUserProfiles() // Reload data to reflect changes
    } catch (err: any) {
      console.error("Error suspending user:", err)
      setError(err.message || "Failed to suspend user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnsuspend = async (userId: string) => {
    if (!confirm("Are you sure you want to unsuspend this account? The user will regain access.")) {
      return
    }
    setActionLoading(userId)
    setError(null)
    try {
      await unsuspendUser(userId)
      await loadUserProfiles() // Reload data to reflect changes
    } catch (err: any) {
      console.error("Error unsuspending user:", err)
      setError(err.message || "Failed to unsuspend user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleTerminate = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently terminate this account? This action cannot be undone.")) {
      return
    }
    setActionLoading(userId)
    setError(null)
    try {
      await terminateUser(userId)
      await loadUserProfiles() // Reload data to reflect changes
    } catch (err: any) {
      console.error("Error terminating user:", err)
      setError(err.message || "Failed to terminate user.")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading user management...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="border-border text-muted-foreground bg-transparent">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-1">View and manage all user accounts on the platform</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 bg-destructive/20 border-destructive/50">
            <AlertTitle>Error</AlertTitle>
            <p className="text-destructive-foreground">{error}</p>
          </Alert>
        )}

        {/* Users Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {userProfiles.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
                <p className="text-gray-500">There are no registered users on the platform yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Joined</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProfiles.map((profile) => (
                      <tr key={profile.id} className="border-b border-gray-700/50">
                        <td className="py-4 px-4">
                          <div>
                            <h3 className="font-medium text-foreground">{profile.full_name || "N/A"}</h3>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              profile.role === "admin" ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/90"
                            }
                          >
                            {profile.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              profile.status === "active"
                                ? "bg-secondary hover:bg-secondary/90"
                                : "bg-destructive hover:bg-destructive/90"
                            }
                          >
                            {profile.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            {profile.status === "active" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuspend(profile.id)}
                                disabled={actionLoading === profile.id || profile.id === currentUser?.id} // Prevent suspending self
                                className="border-accent text-accent-foreground hover:bg-accent/20"
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                {actionLoading === profile.id ? "Suspending..." : "Suspend"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnsuspend(profile.id)}
                                disabled={actionLoading === profile.id}
                                className="border-secondary text-secondary-foreground hover:bg-secondary/20"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {actionLoading === profile.id ? "Unsuspending..." : "Unsuspend"}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTerminate(profile.id)}
                              disabled={actionLoading === profile.id || profile.id === currentUser?.id} // Prevent terminating self
                              className="border-destructive text-destructive-foreground hover:bg-destructive/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
