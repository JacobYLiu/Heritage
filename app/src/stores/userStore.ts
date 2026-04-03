import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { UserProfile, SkillScore } from '../types'

const STORAGE_KEY = 'heritage_user_profile'

interface UserState {
  profile: UserProfile | null
  isLoaded: boolean
  setProfile: (profile: UserProfile) => Promise<void>
  updateSkillScore: (skillScore: SkillScore) => Promise<void>
  clearProfile: () => Promise<void>
  loadProfile: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoaded: false,

  loadProfile: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile
        // Rehydrate Date fields
        parsed.createdAt = new Date(parsed.createdAt)
        parsed.skillScores.lastUpdated = new Date(parsed.skillScores.lastUpdated)
        set({ profile: parsed, isLoaded: true })
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  setProfile: async (profile: UserProfile) => {
    set({ profile })
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(profile))
  },

  updateSkillScore: async (skillScore: SkillScore) => {
    const current = get().profile
    if (!current) return
    const updated: UserProfile = { ...current, skillScores: skillScore }
    set({ profile: updated })
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated))
  },

  clearProfile: async () => {
    set({ profile: null })
    await SecureStore.deleteItemAsync(STORAGE_KEY)
  },
}))
