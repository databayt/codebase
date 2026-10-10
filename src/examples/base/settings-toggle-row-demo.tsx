import { SettingsToggleRow } from "@/components/atom/settings-toggle-row"

export default function SettingsToggleRowDemo() {
  return (
    <>
      <div className="w-full max-w-md">
        <SettingsToggleRow
          label="Notifications"
          description="Receive email notifications"
        />
      </div>
    </>
  )
}
