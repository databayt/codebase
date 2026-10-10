import { ArrowRight, Globe, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Network = "x" | "linkedin" | "github" | "email" | "website"

export type TeamDictionary = {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Accessible names for the social icon links, one per network. */
  networks: Record<Network, string>
  members: {
    name: string
    role: string
    bio?: string
    image: string
    links?: { network: Network; href: string }[]
  }[]
  hiring?: {
    title: string
    description: string
    cta: { label: string; href: string }
  }
}

function BrandIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}

const brandPaths = {
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
}

function NetworkIcon({ network }: { network: Network }) {
  if (network === "email") return <Mail aria-hidden="true" />
  if (network === "website") return <Globe aria-hidden="true" />
  return <BrandIcon path={brandPaths[network]} className="size-4" />
}

export function Team({
  dictionary,
  lang,
  className,
}: {
  dictionary: TeamDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <section
      dir={dir}
      aria-labelledby="team-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          {dictionary.eyebrow && (
            <p className="mb-3 text-sm font-medium text-primary">
              {dictionary.eyebrow}
            </p>
          )}
          <h2
            id="team-title"
            className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {dictionary.title}
          </h2>
          {dictionary.subtitle && (
            <p className="mt-4 text-lg text-pretty text-muted-foreground">
              {dictionary.subtitle}
            </p>
          )}
        </div>

        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {dictionary.members.map((member) => (
            <li key={member.name} className="group flex flex-col">
              <div className="overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 motion-reduce:transition-none"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-primary">{member.role}</p>
              {member.bio && (
                <p className="mt-3 text-sm text-pretty text-muted-foreground">
                  {member.bio}
                </p>
              )}
              {member.links && member.links.length > 0 && (
                <ul className="mt-4 flex items-center gap-1">
                  {member.links.map((link) => (
                    <li key={link.network}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={
                          <a
                            href={link.href}
                            aria-label={`${dictionary.networks[link.network]} · ${member.name}`}
                          />
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <NetworkIcon network={link.network} />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {dictionary.hiring && (
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border bg-muted/40 p-8 md:flex-row md:items-center md:p-10">
            <div className="max-w-xl">
              <h3 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                {dictionary.hiring.title}
              </h3>
              <p className="mt-2 text-pretty text-muted-foreground">
                {dictionary.hiring.description}
              </p>
            </div>
            <Button
              size="lg"
              className="px-5"
              nativeButton={false}
              render={<a href={dictionary.hiring.cta.href} />}
            >
              {dictionary.hiring.cta.label}
              <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
