import { FormFieldText } from "@/components/atom/form-field"

export default function FormFieldDemo() {
  return (
    <>
      <div className="w-full max-w-sm">
        <FormFieldText label="Email" type="email" placeholder="m@example.com" />
      </div>
    </>
  )
}
