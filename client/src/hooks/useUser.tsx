import React from 'react'
import { CustomizationOptions } from '../components/CustomizationBox'
import axios from 'axios'

export interface Timer {
  id: number
  name: string
  lastTime: number
  startDate: string
  paused: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  displayName: string
  avatar: string
  // timers: Timer[]

  textOptions: CustomizationOptions
  activeTimer: number
  createdAt: string
  updatedAt: string
}

interface UserContext {
  user?: User
  timers: Timer[]
  updateUser: (user: Partial<User>) => void
  updateTimer: (id: number, timer: Partial<Timer>) => void
  addTimer: (timer: Timer) => void
  removeTimer: (id: number) => void
}
const userContext = React.createContext<UserContext>({
  user: undefined,
  updateUser: () => {},
  timers: [],
  updateTimer: () => {},
  addTimer: () => {},
  removeTimer: () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState<User | undefined>(undefined)
  const [timers, setTimers] = React.useState<Timer[]>([])

  React.useEffect(() => {
    Promise.all([
      axios.get('/api/timers').then((data) => {
        setTimers((data.data.timers as Timer[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      }),
      axios.get('/api/me').then((data) => {
        setUser(data.data.user)
      }),
    ]).finally(() => setIsLoading(false))
  }, [])

  const updateUser = React.useCallback(
    (user: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev
        return { ...prev, ...user }
      })
    },
    [setUser]
  )

  const updateTimer = React.useCallback(
    (id: number, timer: Partial<Timer>) => {
      setTimers((prev) => {
        const next = [...prev]
        const i = next.findIndex((t) => t.id === id)
        next[i] = { ...next[i], ...timer }
        return next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      })
    },
    [setTimers]
  )

  const addTimer = React.useCallback(
    (timer: Timer) => {
      setTimers((prev) => [...prev, timer].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    },
    [setTimers]
  )

  const removeTimer = React.useCallback(
    (id: number) => {
      setTimers((prev) => prev.filter((t) => t.id !== id))
    },
    [setTimers]
  )

  if (isLoading) return <div>Loading...</div>

  return <userContext.Provider value={{ user, updateUser, timers, addTimer, updateTimer, removeTimer }}>{children}</userContext.Provider>
}

export function useUser() {
  return React.useContext(userContext)
}
