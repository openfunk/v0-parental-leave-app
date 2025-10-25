import { create } from "zustand"
import { createBrowserClient } from "@/lib/supabase/client"

export type Duration = "quick" | "half-day" | "full-day" | "overnight"

export interface LeavingHouseItem {
  id: string
  user_id: string
  label: string
  duration: Duration
  item_order: number
  created_at: string
}

interface LeavingHouseStore {
  items: LeavingHouseItem[]
  isLoading: boolean
  error: string | null
  fetchItems: () => Promise<void>
  addItem: (label: string, duration: Duration) => Promise<void>
  updateItem: (id: string, label: string, duration: Duration) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  initializeDefaultItems: () => Promise<void>
}

const defaultItems: Array<{ label: string; duration: Duration; order: number }> = [
  // Quick trip items (< 1 hour)
  { label: "Keys", duration: "quick", order: 1 },
  { label: "Phone & charger", duration: "quick", order: 2 },
  { label: "Wallet", duration: "quick", order: 3 },
  { label: "Diaper", duration: "quick", order: 4 },
  { label: "Wipes", duration: "quick", order: 5 },
  { label: "Pacifier", duration: "quick", order: 6 },
  { label: "Small toy", duration: "quick", order: 7 },

  // Half day items (1-4 hours)
  { label: "Extra diapers (2-3)", duration: "half-day", order: 8 },
  { label: "Snacks", duration: "half-day", order: 9 },
  { label: "Water bottle", duration: "half-day", order: 10 },
  { label: "Changing mat", duration: "half-day", order: 11 },
  { label: "Hand sanitizer", duration: "half-day", order: 12 },

  // Full day items (4-8 hours)
  { label: "Change of clothes", duration: "full-day", order: 13 },
  { label: "Meals/formula", duration: "full-day", order: 14 },
  { label: "Bibs", duration: "full-day", order: 15 },
  { label: "Sun protection", duration: "full-day", order: 16 },
  { label: "Toys & books", duration: "full-day", order: 17 },
  { label: "Blanket", duration: "full-day", order: 18 },

  // Overnight items (8+ hours)
  { label: "Pajamas", duration: "overnight", order: 19 },
  { label: "Sleep sack", duration: "overnight", order: 20 },
  { label: "Toiletries", duration: "overnight", order: 21 },
  { label: "Medications (if needed)", duration: "overnight", order: 22 },
  { label: "Favorite comfort item", duration: "overnight", order: 23 },
  { label: "Extra outfits (2-3)", duration: "overnight", order: 24 },
]

export const useLeavingHouseStore = create<LeavingHouseStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    console.log("[v0] LeavingHouseStore: Fetching items from database")
    set({ isLoading: true, error: null })

    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("leaving_house_items")
        .select("*")
        .eq("user_id", user.id)
        .order("item_order", { ascending: true })

      if (error) throw error

      console.log("[v0] LeavingHouseStore: Fetched items:", data?.length || 0)

      // If no items exist, initialize with defaults
      if (!data || data.length === 0) {
        console.log("[v0] LeavingHouseStore: No items found, initializing defaults")
        await get().initializeDefaultItems()
        return
      }

      set({ items: data, isLoading: false })
    } catch (error) {
      console.error("[v0] LeavingHouseStore: Error fetching items:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  initializeDefaultItems: async () => {
    console.log("[v0] LeavingHouseStore: Initializing default items")
    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const itemsToInsert = defaultItems.map((item) => ({
        user_id: user.id,
        label: item.label,
        duration: item.duration,
        item_order: item.order,
      }))

      const { data, error } = await supabase.from("leaving_house_items").insert(itemsToInsert).select()

      if (error) throw error

      console.log("[v0] LeavingHouseStore: Initialized default items:", data?.length || 0)
      set({ items: data || [], isLoading: false })
    } catch (error) {
      console.error("[v0] LeavingHouseStore: Error initializing defaults:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addItem: async (label: string, duration: Duration) => {
    console.log("[v0] LeavingHouseStore: Adding item:", { label, duration })
    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const maxOrder = Math.max(...get().items.map((item) => item.item_order), 0)

      const { data, error } = await supabase
        .from("leaving_house_items")
        .insert({
          user_id: user.id,
          label,
          duration,
          item_order: maxOrder + 1,
        })
        .select()
        .single()

      if (error) throw error

      console.log("[v0] LeavingHouseStore: Item added successfully")
      set((state) => ({ items: [...state.items, data] }))
    } catch (error) {
      console.error("[v0] LeavingHouseStore: Error adding item:", error)
      set({ error: (error as Error).message })
      throw error
    }
  },

  updateItem: async (id: string, label: string, duration: Duration) => {
    console.log("[v0] LeavingHouseStore: Updating item:", { id, label, duration })
    try {
      const supabase = createBrowserClient()

      const { data, error } = await supabase
        .from("leaving_house_items")
        .update({ label, duration })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      console.log("[v0] LeavingHouseStore: Item updated successfully")
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? data : item)),
      }))
    } catch (error) {
      console.error("[v0] LeavingHouseStore: Error updating item:", error)
      set({ error: (error as Error).message })
      throw error
    }
  },

  deleteItem: async (id: string) => {
    console.log("[v0] LeavingHouseStore: Deleting item:", id)
    try {
      const supabase = createBrowserClient()

      const { error } = await supabase.from("leaving_house_items").delete().eq("id", id)

      if (error) throw error

      console.log("[v0] LeavingHouseStore: Item deleted successfully")
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }))
    } catch (error) {
      console.error("[v0] LeavingHouseStore: Error deleting item:", error)
      set({ error: (error as Error).message })
      throw error
    }
  },
}))
