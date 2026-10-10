import Link from "next/link"
import { Bookmark } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export type BlogPost = {
  href: string
  title: string
  /** One-line dek shown under the title. */
  description: string
  author: { name: string; avatar?: string }
  /** ISO date, e.g. "2026-05-12". Formatted per language with Intl. */
  date: string
  readingTime: string
  cover: string
  tag: string
}

export function formatDate(iso: string, lang: "en" | "ar") {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function AuthorAvatar({
  author,
  className,
  fallbackClassName,
}: {
  author: BlogPost["author"]
  className: string
  fallbackClassName: string
}) {
  return (
    <Avatar className={className}>
      {author.avatar && <AvatarImage src={author.avatar} alt="" />}
      <AvatarFallback className={fallbackClassName}>
        {initials(author.name)}
      </AvatarFallback>
    </Avatar>
  )
}

/** Full-width feed row: text on the inline-start, thumbnail on the inline-end. */
export function FeedCard({
  post,
  lang,
}: {
  post: BlogPost
  lang: "en" | "ar"
}) {
  return (
    <article className="group">
      <Link
        href={post.href}
        className="flex items-start gap-5 rounded-lg py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-8"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <AuthorAvatar
              author={post.author}
              className="size-5"
              fallbackClassName="text-[9px]"
            />
            <span className="text-foreground/80">{post.author.name}</span>
          </div>

          <h3 className="mt-2 text-lg leading-snug font-bold tracking-tight text-foreground group-hover:underline sm:text-xl">
            {post.title}
          </h3>
          <p className="mt-1 hidden text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
            {post.description}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <Badge
              variant="secondary"
              className="rounded-full font-normal text-muted-foreground"
            >
              {post.tag}
            </Badge>
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <Bookmark aria-hidden="true" className="ms-auto size-4" />
          </div>
        </div>

        <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:w-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
      </Link>
    </article>
  )
}

/** Small stacked item for the sidebar list. */
export function CompactCard({
  post,
  lang,
}: {
  post: BlogPost
  lang: "en" | "ar"
}) {
  return (
    <Link
      href={post.href}
      className="group block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AuthorAvatar
          author={post.author}
          className="size-4"
          fallbackClassName="text-[8px]"
        />
        <span className="text-foreground/80">{post.author.name}</span>
      </div>
      <h4 className="mt-1.5 text-sm leading-snug font-bold text-foreground group-hover:underline">
        {post.title}
      </h4>
      <div className="mt-1.5 text-xs text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date, lang)}</time> ·{" "}
        {post.readingTime}
      </div>
    </Link>
  )
}
