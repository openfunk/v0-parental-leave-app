"use client"

import { LeavingHouseChecklist } from "@/components/dashboard/leaving-house-checklist"
import { ManageLeavingHouseItems } from "@/components/checklist/manage-leaving-house-items"

export default function ChecklistPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">Leaving House Checklist</h1>
        <p className="text-muted-foreground">Customize your checklist for different trip durations</p>
      </div>

      {/* Preview Card */}
      <div className="mb-8">
        <LeavingHouseChecklist editMode={true} />
      </div>

      {/* Management Interface */}
      <ManageLeavingHouseItems />
    </div>
  )
}
