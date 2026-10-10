"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import type { HeaderDictionary } from "@/registry/bases/base/blocks/header-05/components/header-05"

/**
 * A pill (desktop) / icon (phone) trigger that drops a full-width search tray
 * under the header: input, then popular terms filtered live as you type.
 * Closes on Escape, on the scrim, or on Cancel.
 */
export function HeaderSearch({
  search,
}: {
  search: HeaderDictionary["search"]
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const reduceMotion = useReducedMotion()
  const trayId = React.useId()

  React.useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const trimmed = query.trim().toLowerCase()
  const suggestions = trimmed
    ? search.popular.filter((term) => term.toLowerCase().includes(trimmed))
    : search.popular

  return (
    <>
      <button
        type="button"
        aria-label={search.label}
        aria-expanded={open}
        aria-controls={trayId}
        onClick={() => setOpen((value) => !value)}
        className="group flex items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="hidden h-9 w-45 items-center gap-2 rounded-full bg-muted ps-3.5 text-muted-foreground transition-colors group-hover:bg-accent lg:flex">
          <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-foreground" />
          <span className="text-sm">{search.placeholder}</span>
        </span>
        <span className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors group-hover:bg-muted lg:hidden">
          <SearchIcon aria-hidden="true" className="size-6" strokeWidth={1.5} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              aria-hidden="true"
              className="fixed inset-0 z-30 bg-foreground/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="tray"
              id={trayId}
              className="absolute inset-x-0 top-full z-50 border-t bg-background shadow-[0_16px_24px_-12px_rgb(0_0_0/0.12)]"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <form
                role="search"
                onSubmit={(event) => event.preventDefault()}
                className="mx-auto max-w-[1200px] px-4 py-4 lg:px-10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-1 items-center gap-3 rounded-full bg-muted px-5 py-3 focus-within:ring-3 focus-within:ring-ring/50">
                    <SearchIcon aria-hidden="true" className="size-6 shrink-0" />
                    <input
                      ref={inputRef}
                      type="search"
                      name="q"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={search.placeholder}
                      aria-label={search.label}
                      className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
                    />
                    {query && (
                      <button
                        type="button"
                        aria-label={search.clear}
                        onClick={() => {
                          setQuery("")
                          inputRef.current?.focus()
                        }}
                        className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <XIcon aria-hidden="true" className="size-5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="shrink-0 rounded-md px-2 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {search.cancel}
                  </button>
                </div>

                {suggestions.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm text-muted-foreground">
                      {search.popularLabel}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {suggestions.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => {
                              setQuery(term)
                              inputRef.current?.focus()
                            }}
                            className="rounded-full bg-muted px-4 py-2 text-sm transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
