"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  category: "documents" | "medical" | "home" | "work" | "baby-gear" | "other"
  completed: boolean
  dueDate?: string
}

interface ChecklistStore {
  items: ChecklistItem[]
  addItem: (item: Omit<ChecklistItem, "id">) => void
  toggleItem: (id: string) => void
  deleteItem: (id: string) => void
  updateItem: (id: string, item: Partial<ChecklistItem>) => void
  getItemsByCategory: (category: ChecklistItem["category"]) => ChecklistItem[]
  getCompletionPercentage: () => number
}

const defaultItems: Omit<ChecklistItem, "id">[] = [
  {
    title: "Register birth certificate",
    description: "Contact local authorities to register your baby's birth",
    category: "documents",
    completed: false,
  },
  {
    title: "Apply for parental leave benefits",
    description: "Submit application to social insurance agency",
    category: "documents",
    completed: false,
  },
  {
    title: "Update health insurance",
    description: "Add baby to your health insurance plan",
    category: "medical",
    completed: false,
  },
  {
    title: "Schedule pediatrician appointment",
    description: "Book first checkup within 2 weeks",
    category: "medical",
    completed: false,
  },
  {
    title: "Prepare nursery",
    description: "Set up crib, changing table, and storage",
    category: "home",
    completed: false,
  },
  {
    title: "Stock up on essentials",
    description: "Diapers, wipes, formula/breastfeeding supplies",
    category: "home",
    completed: false,
  },
  {
    title: "Notify employer",
    description: "Confirm leave dates and handover plan",
    category: "work",
    completed: false,
  },
  {
    title: "Get car seat",
    description: "Purchase and install infant car seat",
    category: "baby-gear",
    completed: false,
  },
  {
    title: "Buy stroller",
    description: "Choose appropriate stroller for your needs",
    category: "baby-gear",
    completed: false,
  },
]

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      items: defaultItems.map((item, index) => ({ ...item, id: `default-${index}` })),
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now().toString() }],
        })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateItem: (id, updatedItem) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
        })),
      getItemsByCategory: (category) => {
        return get().items.filter((item) => item.category === category)
      },
      getCompletionPercentage: () => {
        const items = get().items
        if (items.length === 0) return 0
        const completed = items.filter((item) => item.completed).length
        return Math.round((completed / items.length) * 100)
      },
    }),
    {
      name: "checklist-storage",
    },
  ),
)
