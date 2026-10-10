import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type TestimonialsDictionary = {
  title: string
  description: string
  items: {
    quote: string
    name: string
    role: string
    avatar: string
  }[]
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

export function Testimonials({
  dictionary,
  lang,
  className,
}: {
  dictionary: TestimonialsDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <section
      dir={dir}
      aria-labelledby="testimonials-01-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <h2
            id="testimonials-01-title"
            className="text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {dictionary.title}
          </h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground md:text-lg">
            {dictionary.description}
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.items.map((item) => (
            <li key={item.name}>
              <figure className="flex h-full flex-col justify-between gap-6 rounded-xl border bg-card p-6 text-card-foreground">
                <blockquote className="text-sm leading-relaxed text-muted-foreground">
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage src={item.avatar} alt="" />
                    <AvatarFallback>{initials(item.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
