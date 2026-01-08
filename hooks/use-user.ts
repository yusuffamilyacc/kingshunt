"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name?: string
  role: string
}

export function useUser() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Get user role from database
          const response = await fetch(`/api/users/${authUser.id}`)
          if (response.ok) {
            const userData = await response.json()
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              name: userData.name,
              role: userData.role,
            })
          } else {
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              name: authUser.user_metadata?.name,
              role: "MEMBER",
            })
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser()
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return { user, loading, signOut }
}


