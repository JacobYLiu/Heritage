import { create } from 'zustand'
import { RoleplayTurn } from '../types'

interface RoleplayState {
  scenarioId: string | null
  turnHistory: RoleplayTurn[]
  isRecording: boolean
  pauseStartTime: number | null

  setScenarioId: (id: string) => void
  addTurn: (turn: RoleplayTurn) => void
  setIsRecording: (recording: boolean) => void
  setPauseStartTime: (time: number | null) => void
  clearRoleplay: () => void
}

const EMPTY_STATE: Pick<RoleplayState, 'scenarioId' | 'turnHistory' | 'isRecording' | 'pauseStartTime'> = {
  scenarioId: null,
  turnHistory: [],
  isRecording: false,
  pauseStartTime: null,
}

export const useRoleplayStore = create<RoleplayState>((set) => ({
  ...EMPTY_STATE,

  setScenarioId: (id) => set({ scenarioId: id }),

  addTurn: (turn) =>
    set((state) => ({ turnHistory: [...state.turnHistory, turn] })),

  setIsRecording: (recording) => set({ isRecording: recording }),

  setPauseStartTime: (time) => set({ pauseStartTime: time }),

  clearRoleplay: () => set({ ...EMPTY_STATE }),
}))
