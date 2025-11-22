import { SignupForm } from "@/registry/default/templates/signup-04/components/signup-form"

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center ">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
