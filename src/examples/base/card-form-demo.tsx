import { ButtonGroup } from "@/components/atom/button-group"
import { CardForm } from "@/components/atom/card-form"
import { LabeledInput } from "@/components/atom/labeled-input"

export default function CardFormDemo() {
  return (
    <>
      <CardForm
        title="Contact Us"
        description="Fill out the form below."
        footer={<ButtonGroup primaryLabel="Send" secondaryLabel="Cancel" />}
      >
        <LabeledInput label="Name" placeholder="Your name" />
        <LabeledInput label="Email" type="email" placeholder="your@email.com" />
      </CardForm>
    </>
  )
}
