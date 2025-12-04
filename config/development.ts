/**
 * Development Configuration
 *
 * WARNING: This file contains mock data for development ONLY
 * DELETE OR DISABLE before deploying to production
 *
 * This file centralizes all mock/test data used during development
 * to make it easy to find and remove before production deployment.
 */

// Check if bypass is enabled - works on both server and client
// Uses NEXT_PUBLIC_ prefix for client-side access
export const isDevelopmentBypass = () => {
  const bypass = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true" || process.env.BYPASS_AUTH === "true"
  return bypass
}

// Safety check: Throw error if bypass is enabled in production (server-side only)
if (typeof window === "undefined" && process.env.NODE_ENV === "production" && process.env.BYPASS_AUTH === "true") {
  throw new Error("SECURITY ERROR: Auth bypass is enabled in production! Set BYPASS_AUTH=false")
}

/**
 * Mock User Data
 * Used by: middleware.ts, lib/supabase/server.ts, lib/supabase/client.ts
 *
 * This mock user bypasses all authentication and allows direct access
 * to protected routes during development.
 */
export const MOCK_USER_ID = "dev-user-12345"
export const MOCK_USER_EMAIL = "dev@test.com"

export const MOCK_USER_DETAILS = {
  user_id: MOCK_USER_ID,
  first_name: "Dev",
  last_name: "User",
  phone: "+46 70 123 4567",
  city: "Stockholm",
  country: "Sweden",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const MOCK_PROFILE = {
  id: MOCK_USER_ID,
  email: MOCK_USER_EMAIL,
  first_name: "Dev",
  last_name: "User",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const MOCK_CHILDREN = [
  {
    id: "mock-child-1",
    user_id: MOCK_USER_ID,
    name: "Emma",
    birth_date: "2024-06-15",
    gender: "female",
    created_at: new Date().toISOString(),
  },
]

export const MOCK_PARENTAL_LEAVE = {
  id: "mock-leave-1",
  user_id: MOCK_USER_ID,
  start_date: "2024-06-01",
  end_date: "2025-06-01",
  created_at: new Date().toISOString(),
}

export const MOCK_LEAVING_HOUSE_ITEMS = [
  {
    id: "mock-item-1",
    user_id: MOCK_USER_ID,
    label: "Keys",
    duration: "quick",
    item_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-2",
    user_id: MOCK_USER_ID,
    label: "Phone & charger",
    duration: "quick",
    item_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-3",
    user_id: MOCK_USER_ID,
    label: "Wallet",
    duration: "quick",
    item_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-4",
    user_id: MOCK_USER_ID,
    label: "Diaper",
    duration: "quick",
    item_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-5",
    user_id: MOCK_USER_ID,
    label: "Wipes",
    duration: "quick",
    item_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-6",
    user_id: MOCK_USER_ID,
    label: "Extra diapers (2-3)",
    duration: "half-day",
    item_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-7",
    user_id: MOCK_USER_ID,
    label: "Snacks",
    duration: "half-day",
    item_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-8",
    user_id: MOCK_USER_ID,
    label: "Change of clothes",
    duration: "full-day",
    item_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-9",
    user_id: MOCK_USER_ID,
    label: "Pajamas",
    duration: "overnight",
    item_order: 9,
    created_at: new Date().toISOString(),
  },
]

// Combined mock user object for easy access
export const MOCK_USER = {
  id: MOCK_USER_ID,
  email: MOCK_USER_EMAIL,
  user_metadata: {
    first_name: "Dev",
    last_name: "User",
  },
  user_details: MOCK_USER_DETAILS,
  profile: MOCK_PROFILE,
  children: MOCK_CHILDREN,
  parental_leave: MOCK_PARENTAL_LEAVE,
  leaving_house_items: MOCK_LEAVING_HOUSE_ITEMS,
}

/**
 * Mock Supabase Client
 * Returns mock data instead of making real database calls
 */
export const createMockSupabaseClient = () => {
  console.log("[v0] Using MOCK Supabase client (bypass mode active)")

  // Helper to create chainable query builder
  const createQueryBuilder = (table: string) => {
    let queryData: any[] = []
    const filters: Record<string, any> = {}

    const getDataForTable = () => {
      switch (table) {
        case "user_details":
          return [MOCK_USER_DETAILS]
        case "profiles":
          return [MOCK_PROFILE]
        case "parental_leave":
          return [MOCK_PARENTAL_LEAVE]
        case "children":
          return MOCK_CHILDREN
        case "leaving_house_items":
          return MOCK_LEAVING_HOUSE_ITEMS
        case "growth_entries":
          return []
        default:
          return []
      }
    }

    const builder: any = {
      select: (columns?: string) => {
        queryData = getDataForTable()
        console.log(`[v0] Mock: ${table}.select(${columns || "*"})`)
        return builder
      },
      insert: (data: any) => {
        console.log(`[v0] Mock: ${table}.insert()`, data)
        if (Array.isArray(data)) {
          queryData = data.map((item, index) => ({ ...item, id: `mock-new-${index}` }))
        } else {
          queryData = [{ ...data, id: `mock-new-${Date.now()}` }]
        }
        return builder
      },
      update: (data: any) => {
        console.log(`[v0] Mock: ${table}.update()`, data)
        return builder
      },
      delete: () => {
        console.log(`[v0] Mock: ${table}.delete()`)
        return builder
      },
      eq: (column: string, value: any) => {
        console.log(`[v0] Mock: .eq(${column}, ${value})`)
        filters[column] = value
        queryData = getDataForTable().filter((item: any) => item[column] === value)
        return builder
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        console.log(`[v0] Mock: .order(${column})`)
        return builder
      },
      limit: (count: number) => {
        console.log(`[v0] Mock: .limit(${count})`)
        queryData = queryData.slice(0, count)
        return builder
      },
      single: async () => {
        console.log(`[v0] Mock: .single() returning:`, queryData[0] || null)
        return { data: queryData[0] || null, error: null }
      },
      then: (resolve: any) => {
        return Promise.resolve({ data: queryData, error: null }).then(resolve)
      },
    }

    return builder
  }

  return {
    auth: {
      getUser: async () => {
        console.log("[v0] Mock auth.getUser() called")
        return {
          data: { user: MOCK_USER },
          error: null,
        }
      },
      getSession: async () => {
        console.log("[v0] Mock auth.getSession() called")
        return {
          data: {
            session: {
              user: MOCK_USER,
              access_token: "mock-token",
              refresh_token: "mock-refresh-token",
            },
          },
          error: null,
        }
      },
      signOut: async () => {
        console.log("[v0] Mock auth.signOut() called")
        return { error: null }
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        console.log("[v0] Mock auth.onAuthStateChange() called")
        // Immediately call with mock session
        setTimeout(() => {
          callback("SIGNED_IN", {
            user: MOCK_USER,
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
          })
        }, 0)
        // Return mock subscription object
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                console.log("[v0] Mock auth subscription unsubscribed")
              },
            },
          },
        }
      },
    },
    from: (table: string) => createQueryBuilder(table),
  }
}

// Log when bypass is active (only on server to avoid duplicate logs)
if (typeof window === "undefined" && isDevelopmentBypass()) {
  console.log("=".repeat(60))
  console.log("  DEVELOPMENT AUTH BYPASS IS ACTIVE")
  console.log("=".repeat(60))
  console.log("Mock user:", MOCK_USER_EMAIL)
  console.log("Location:", MOCK_USER_DETAILS.city, MOCK_USER_DETAILS.country)
  console.log("To disable: Remove BYPASS_AUTH=true from .env.local")
  console.log("=".repeat(60))
}
