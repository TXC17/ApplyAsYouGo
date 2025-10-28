"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

// 1. Define the shape of your context value
interface User {
  name: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: User | null
  isLoggedIn: boolean
  AuthorizationToken: string
  storeTokenInLS: (token: string, userData?: User) => void
  logoutUser: () => Promise<void>
  loading: boolean
}

// 2. Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3. Provider Props
interface AuthProviderProps {
  children: ReactNode
}

// 4. AuthProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isLoggedIn = !!token
  const AuthorizationToken = `Bearer ${token}`

  const storeTokenInLS = (newToken: string, userData?: User) => {
    setToken(newToken)
    setUser(userData || null)
    localStorage.setItem("token", newToken)
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  const logoutUser = async () => {
    try {
      // Call server logout endpoint if token exists
      if (token) {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/logout' || 'http://localhost:5000/user/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error("Error during server logout:", error)
      // Continue with client-side logout even if server call fails
    } finally {
      // Always clear client-side data
      setToken(null)
      setUser(null)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      console.log("User logged out successfully")
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (storedToken) {
      setToken(storedToken)
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
      }
    }
    
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn, AuthorizationToken, storeTokenInLS, logoutUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 5. Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
