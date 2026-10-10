import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <p className="text-[0.8rem] text-muted-foreground">
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
              <p className="text-[0.8rem] text-muted-foreground">
                Must be at least 8 characters long.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">
                Confirm Password
              </Label>
              <Input id="confirm-password" type="password" required />
              <p className="text-[0.8rem] text-muted-foreground">
                Please confirm your password.
              </p>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Sign up with Google
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="#" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
