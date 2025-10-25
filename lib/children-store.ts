"use client"

import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

export interface Child {
  id: string
  name: string
  birthDate: string
  gender: string
  photo?: string
  notes?: string
  userId?: string
}

export interface GrowthEntry {
  id: string
  childId: string
  date: string
  weight: number
  height: number
  headCircumference?: number
  notes?: string
}

interface ChildrenStore {
  children: Child[]
  growthEntries: GrowthEntry[]
  isLoading: boolean
  error: string | null
  fetchChildren: () => Promise<void>
  addChild: (child: Omit<Child, "id">) => Promise<void>
  updateChild: (id: string, child: Partial<Child>) => Promise<void>
  deleteChild: (id: string) => Promise<void>
  fetchGrowthEntries: (childId: string) => Promise<void>
  addGrowthEntry: (entry: Omit<GrowthEntry, "id">) => Promise<void>
}

export const useChildrenStore = create<ChildrenStore>()((set, get) => ({
  children: [],
  growthEntries: [],
  isLoading: false,
  error: null,

  fetchChildren: async () => {
    console.log("[v0] ChildrenStore: Fetching children from database")
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const children = (data || []).map((child) => ({
        id: child.id,
        name: child.name,
        birthDate: child.birth_date,
        gender: child.gender,
        notes: child.notes,
        userId: child.user_id,
      }))

      console.log("[v0] ChildrenStore: Fetched children:", children.length)
      set({ children, isLoading: false })
    } catch (error) {
      console.error("[v0] ChildrenStore: Error fetching children:", error)
      set({ error: error instanceof Error ? error.message : "Failed to fetch children", isLoading: false })
    }
  },

  addChild: async (child) => {
    console.log("[v0] ChildrenStore: Adding child:", child)
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("children")
        .insert({
          name: child.name,
          birth_date: child.birthDate,
          gender: child.gender,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      const newChild: Child = {
        id: data.id,
        name: data.name,
        birthDate: data.birth_date,
        gender: data.gender,
        userId: data.user_id,
      }

      console.log("[v0] ChildrenStore: Child added successfully:", newChild.id)
      set((state) => ({ children: [newChild, ...state.children], isLoading: false }))
    } catch (error) {
      console.error("[v0] ChildrenStore: Error adding child:", error)
      set({ error: error instanceof Error ? error.message : "Failed to add child", isLoading: false })
      throw error
    }
  },

  updateChild: async (id, updatedChild) => {
    console.log("[v0] ChildrenStore: Updating child:", id, updatedChild)
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      const updateData: any = {}
      if (updatedChild.name) updateData.name = updatedChild.name
      if (updatedChild.birthDate) updateData.birth_date = updatedChild.birthDate
      if (updatedChild.gender) updateData.gender = updatedChild.gender

      const { error } = await supabase.from("children").update(updateData).eq("id", id)

      if (error) throw error

      console.log("[v0] ChildrenStore: Child updated successfully")
      set((state) => ({
        children: state.children.map((child) => (child.id === id ? { ...child, ...updatedChild } : child)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("[v0] ChildrenStore: Error updating child:", error)
      set({ error: error instanceof Error ? error.message : "Failed to update child", isLoading: false })
      throw error
    }
  },

  deleteChild: async (id) => {
    console.log("[v0] ChildrenStore: Deleting child:", id)
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      const { error } = await supabase.from("children").delete().eq("id", id)

      if (error) throw error

      console.log("[v0] ChildrenStore: Child deleted successfully")
      set((state) => ({
        children: state.children.filter((child) => child.id !== id),
        growthEntries: state.growthEntries.filter((entry) => entry.childId !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("[v0] ChildrenStore: Error deleting child:", error)
      set({ error: error instanceof Error ? error.message : "Failed to delete child", isLoading: false })
      throw error
    }
  },

  fetchGrowthEntries: async (childId) => {
    console.log("[v0] ChildrenStore: Fetching growth entries for child:", childId)
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("growth_entries")
        .select("*")
        .eq("child_id", childId)
        .order("date", { ascending: false })

      if (error) throw error

      const entries = (data || []).map((entry) => ({
        id: entry.id,
        childId: entry.child_id,
        date: entry.date,
        weight: Number(entry.weight),
        height: Number(entry.height),
        headCircumference: entry.head_circumference ? Number(entry.head_circumference) : undefined,
        notes: entry.notes,
      }))

      console.log("[v0] ChildrenStore: Fetched growth entries:", entries.length)
      set({ growthEntries: entries, isLoading: false })
    } catch (error) {
      console.error("[v0] ChildrenStore: Error fetching growth entries:", error)
      set({ error: error instanceof Error ? error.message : "Failed to fetch growth entries", isLoading: false })
    }
  },

  addGrowthEntry: async (entry) => {
    console.log("[v0] ChildrenStore: Adding growth entry:", entry)
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("growth_entries")
        .insert({
          child_id: entry.childId,
          date: entry.date,
          weight: entry.weight,
          height: entry.height,
          head_circumference: entry.headCircumference,
          notes: entry.notes,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      const newEntry: GrowthEntry = {
        id: data.id,
        childId: data.child_id,
        date: data.date,
        weight: Number(data.weight),
        height: Number(data.height),
        headCircumference: data.head_circumference ? Number(data.head_circumference) : undefined,
        notes: data.notes,
      }

      console.log("[v0] ChildrenStore: Growth entry added successfully")
      set((state) => ({ growthEntries: [newEntry, ...state.growthEntries], isLoading: false }))
    } catch (error) {
      console.error("[v0] ChildrenStore: Error adding growth entry:", error)
      set({ error: error instanceof Error ? error.message : "Failed to add growth entry", isLoading: false })
      throw error
    }
  },
}))
