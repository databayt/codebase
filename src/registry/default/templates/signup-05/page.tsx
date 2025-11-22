import { SignupForm } from "@/registry/default/templates/signup-05/components/signup-form"

export default function Page() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center ga ">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
