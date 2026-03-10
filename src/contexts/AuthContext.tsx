import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'customer' | 'host'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; success?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchingProfile, setFetchingProfile] = useState(false)

  useEffect(() => {
    let mounted = true
    let authSubscription: any = null

    // Get initial session with retry logic
    const getInitialSession = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (!mounted) return true
          
          if (error) {
            console.error(`Error getting session (attempt ${i + 1}):`, error)
            if (i === retries - 1) throw error
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
          }

          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user && !fetchingProfile) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          
          return true
        } catch (error) {
          console.error(`Error in getInitialSession (attempt ${i + 1}):`, error)
          if (i === retries - 1) {
            if (mounted) setLoading(false)
            return false
          }
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      return false
    }

    getInitialSession().then(() => {
      if (mounted) setLoading(false)
    })

    // Listen for auth changes with debouncing
    let authChangeTimeout: NodeJS.Timeout
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (!mounted) return
      
      console.log('Auth state changed:', event)
      
      // Debounce rapid auth changes
      clearTimeout(authChangeTimeout)
      authChangeTimeout = setTimeout(async () => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user && !fetchingProfile) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }, 100)
    }

    // Subscribe to auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)
      authSubscription = subscription
    } catch (error) {
      console.error('Error setting up auth subscription:', error)
    }

    return () => {
      mounted = false
      clearTimeout(authChangeTimeout)
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    if (fetchingProfile) return
    
    setFetchingProfile(true)
    
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        console.log('Profile found:', data)
        setProfile(data)
      } else {
        console.log('No profile found, creating new one...')
        
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user?.email || '',
            full_name: user?.user_metadata?.full_name || null,
            role: 'customer'
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating profile:', insertError)
        } else {
          console.log('Profile created successfully:', newProfile)
          setProfile(newProfile)
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    } finally {
      setFetchingProfile(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Signing up user:', email, 'with name:', fullName)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      })

      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      console.log('Sign up data:', data)

      if (data.user && !data.session) {
        console.log('User created but no session, trying to sign in...')
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (signInError) {
          console.error('Sign in error:', signInError)
          return { error: 'Registration successful! Please check your email for confirmation.' }
        }
        
        console.log('Sign in successful, creating profile...')
        
        // If sign in successful, create profile with full_name
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              full_name: fullName,
              role: 'customer'
            })
          
          if (profileError) {
            console.error('Error creating profile with full_name:', profileError)
          } else {
            console.log('Profile created successfully during signup')
          }
        }
        
        return { success: true, error: null }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Sign up exception:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setProfile(null)
      // Redirect to home after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!profile) return { error: 'No profile found' }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)

      if (!error) {
        setProfile({ ...profile, ...updates })
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
