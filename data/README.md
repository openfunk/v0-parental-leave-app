# Data Directory

This directory contains JSON files with static configuration data used throughout the application. These files make it easy to modify content without changing code.

## Files

### cities.json
**Purpose:** List of the 5 biggest cities per Scandinavian country for city selection dropdowns.

**Consumed by:**
- `components/auth/register-form.tsx` - Registration form city selector
- `components/profile/profile-form.tsx` - Profile edit form city selector

**Structure:**
\`\`\`json
{
  "cities": {
    "country_code": ["City1", "City2", ...]
  }
}
\`\`\`

### activities.json
**Purpose:** Activity suggestions for parents with babies and toddlers, including age ranges, duration, type, and location information.

**Consumed by:**
- `components/calendar/activity-suggestions-card.tsx` - Full activity list with filters on calendar page
- `components/dashboard/activity-suggestions.tsx` - Quick activity suggestions on dashboard (first 3 items)

**Structure:**
\`\`\`json
{
  "activities": [
    {
      "title": "Activity Name",
      "description": "Activity description",
      "ageRange": ["0-6m", "6-12m", ...],
      "duration": "short|medium|long",
      "type": "physical|creative|educational|social|outdoor|indoor",
      "location": "indoor|outdoor|both"
    }
  ],
  "labels": {
    "ageRange": { "0-6m": "0-6 months", ... },
    "type": { "physical": "Physical", ... },
    "duration": { "short": "< 30 min", ... }
  }
}
\`\`\`

### clothing-rules.json
**Purpose:** Temperature-based clothing recommendations for babies, including layers, accessories, and tips based on weather conditions.

**Consumed by:**
- `components/dashboard/clothing-recommendations.tsx` - Weather-based clothing suggestions

**Structure:**
\`\`\`json
{
  "temperatureRanges": {
    "veryCold|cold|mild|warm|hot": {
      "threshold": number | [min, max],
      "operator": "<|between|>=",
      "label": "Temperature Range Label",
      "layers": [
        {
          "label": "Layer Name",
          "items": ["Item1", "Item2", ...]
        }
      ],
      "accessories": ["Accessory1", "Accessory2", ...],
      "tips": ["Tip1", "Tip2", ...]
    }
  },
  "weatherConditions": {
    "rain|snow|windy": {
      "conditionCodes": [1063, 1150, ...],
      "accessories": ["Accessory1", ...],
      "tips": ["Tip1", ...]
    }
  }
}
\`\`\`

## Database-Fetched Data (NOT in JSON)

The following data is fetched from the Supabase database and should NOT be moved to JSON files:

- **User data** - `user_details`, `profiles` tables
- **Children data** - `children` table
- **Growth entries** - `growth_entries` table (if exists)
- **Calendar events** - `calendar_events` table
- **Leaving house checklist items** - `leaving_house_items` table
- **Parental leave data** - `parental_leave` table

## Modifying Data

To modify any static data:

1. Edit the appropriate JSON file in this directory
2. Follow the existing structure
3. The changes will be reflected immediately in the application (no code changes needed)
4. Ensure JSON is valid before saving

## Adding New Data

When adding new static data:

1. Create a new JSON file in this directory
2. Add a description comment at the top of the JSON file
3. Import the JSON file in the component that needs it: `import data from "@/data/filename.json"`
4. Update this README with the new file's purpose and structure
