import { LabeledSelect } from "@/components/atom/labeled-select"

export default function LabeledSelectDemo() {
  return (
    <>
      <LabeledSelect
        label="Category"
        options={[
          { value: "billing", label: "Billing" },
          { value: "support", label: "Support" },
          { value: "account", label: "Account" },
        ]}
        defaultValue="billing"
      />
    </>
  )
}
