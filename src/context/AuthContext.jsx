import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, ADMIN_EMAILS, hasRole, getUserRoles } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      await checkAdminStatus(session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false)
      setRoles([])
      return
    }

    // Check email-based admin (legacy support)
    const emailAdmin = ADMIN_EMAILS.includes(currentUser.email)
    
    // Check role-based admin
    const userRoles = await getUserRoles(currentUser.id)
    setRoles(userRoles)
    const roleAdmin = userRoles.includes('admin')
    
    setIsAdmin(emailAdmin || roleAdmin)
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, roles, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
