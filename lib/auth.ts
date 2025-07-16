import { supabase } from "./supabase"

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

// New Admin Functions for User Management
export async function suspendUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ status: "suspended" })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function unsuspendUser(userId: string) {
  const { data, error } = await supabase.from("users").update({ status: "active" }).eq("id", userId).select().single()

  if (error) throw error
  return data
}

export async function terminateUser(userId: string) {
  // First, delete user from public.users table
  const { error: userDeleteError } = await supabase.from("users").delete().eq("id", userId)
  if (userDeleteError) {
    console.error("Error deleting user from public.users:", userDeleteError)
    throw userDeleteError
  }

  // Then, delete user from auth.users (requires service role key on server)
  // This part typically runs on the server-side (e.g., a server action or API route)
  // For client-side, you'd need to expose a server action/route that uses the service role key.
  // For simplicity in this client-side context, we'll just delete from public.users.
  // If you need to delete from auth.users, you'd create a server action like:
  /*
  'use server'
  import { createClient } from '@supabase/supabase-js'
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  export async function deleteAuthUser(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) throw error
  }
  */
  // For now, this client-side function only deletes from the public.users table.
  // The actual Supabase `auth.users` record will remain unless deleted via a server-side function.
}
