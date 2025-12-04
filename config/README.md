# Development Configuration

This directory contains configuration files for development and testing purposes.

## ⚠️ IMPORTANT: Production Safety

**Before deploying to production, you MUST:**

1. Set `BYPASS_AUTH=false` in your environment variables (or remove it entirely)
2. Verify `NODE_ENV=production` is set
3. Review all files in this directory and ensure no mock data is active

## Files in this directory

### `development.ts`
Contains all mock data and bypass logic for development:
- Mock user credentials
- Mock database records (user details, children, parental leave)
- Mock Supabase client that returns fake data
- Safety checks to prevent production usage

## How the Bypass Works

When `BYPASS_AUTH=true` is set in `.env.local`:

1. **Middleware** (`lib/supabase/middleware.ts`) - Skips all auth checks
2. **Server Client** (`lib/supabase/server.ts`) - Returns mock Supabase client
3. **Browser Client** (`lib/supabase/client.ts`) - Returns mock Supabase client  
4. **API Routes** (`app/api/*/route.ts`) - Use mock user data

This allows you to:
- Access `/dashboard` directly without logging in
- Test features without entering credentials
- Develop faster without authentication friction

## Consumed By

The mock data in `development.ts` is used by:
- `lib/supabase/middleware.ts` - Auth bypass in middleware
- `lib/supabase/server.ts` - Mock server-side Supabase client
- `lib/supabase/client.ts` - Mock browser-side Supabase client
- `app/api/weather/route.ts` - Mock user location for weather

## Testing

To test the bypass:
1. Ensure `BYPASS_AUTH=true` in `.env.local`
2. Restart your dev server
3. Navigate to `http://localhost:3000/dashboard`
4. You should be logged in as the mock user automatically

## Disabling Bypass

To disable and use real authentication:
1. Set `BYPASS_AUTH=false` in `.env.local` (or remove the line)
2. Restart your dev server
3. You'll need to login with real credentials
