import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CompactCard,
  FeedCard,
  type BlogPost,
} from "@/registry/bases/base/blocks/blog-01/components/blog-01-card"

export type { BlogPost }

export type BlogDictionary = {
  title: string
  subtitle: string
  staffPicks: string
  topicsTitle: string
  topics: string[]
  about?: {
    name: string
    initials: string
    role: string
    description: string
  }
  posts: BlogPost[]
  /** How many posts the sidebar list shows (defaults to 3). */
  picks?: number
}

export function Blog({
  dictionary,
  lang,
  className,
}: {
  dictionary: BlogDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"
  const { posts, topics, about } = dictionary
  const picks = posts.slice(0, dictionary.picks ?? 3)

  return (
    <section
      dir={dir}
      aria-labelledby="blog-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="border-b pb-8">
          <h2
            id="blog-title"
            className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl",
              lang === "en" ? "font-serif" : "font-heading"
            )}
          >
            {dictionary.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            {dictionary.subtitle}
          </p>

          {/* Topic strip (mobile only; the sidebar carries it on lg+). */}
          <ul
            aria-label={dictionary.topicsTitle}
            className="mt-6 flex gap-2 overflow-x-auto [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
          >
            {topics.map((topic) => (
              <li key={topic} className="shrink-0">
                <Badge
                  variant="secondary"
                  className="rounded-full font-normal text-muted-foreground"
                >
                  {topic}
                </Badge>
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="divide-y">
            {posts.map((post) => (
              <FeedCard key={post.href + post.title} post={post} lang={lang} />
            ))}
          </div>

          <aside className="mt-10 hidden lg:mt-0 lg:block">
            <div className="flex flex-col gap-8 py-6 lg:sticky lg:top-24">
              <section aria-labelledby="blog-picks">
                <h3
                  id="blog-picks"
                  className="text-sm font-bold tracking-tight text-foreground"
                >
                  {dictionary.staffPicks}
                </h3>
                <div className="mt-5 flex flex-col gap-5">
                  {picks.map((post) => (
                    <CompactCard
                      key={post.href + post.title}
                      post={post}
                      lang={lang}
                    />
                  ))}
                </div>
              </section>

              <Separator />

              <section aria-labelledby="blog-topics">
                <h3
                  id="blog-topics"
                  className="text-sm font-bold tracking-tight text-foreground"
                >
                  {dictionary.topicsTitle}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <li key={topic}>
                      <Badge
                        variant="secondary"
                        className="rounded-full font-normal text-muted-foreground"
                      >
                        {topic}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </section>

              {about && (
                <>
                  <Separator />
                  <div className="rounded-lg border p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="text-xs">
                          {about.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-semibold text-foreground">
                          {about.name}
                        </div>
                        <div className="text-muted-foreground">{about.role}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {about.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
