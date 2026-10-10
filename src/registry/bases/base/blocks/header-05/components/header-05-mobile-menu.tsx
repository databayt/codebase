"use client"

import * as React from "react"
import { MenuIcon, XIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { HeaderDictionary } from "@/registry/bases/base/blocks/header-05/components/header-05"

/** Drawer nav for small screens; categories with a mega menu expand in place. */
export function HeaderMobileMenu({
  dictionary,
  lang,
}: {
  dictionary: HeaderDictionary
  lang: "en" | "ar"
}) {
  const [open, setOpen] = React.useState(false)
  const dir = lang === "ar" ? "rtl" : "ltr"
  const close = () => setOpen(false)
  const { nav, topBar, menu } = dictionary

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            className="size-11 rounded-full lg:hidden"
          />
        }
      >
        <MenuIcon className="size-6" strokeWidth={1.5} />
        <span className="sr-only">{menu.open}</span>
      </SheetTrigger>
      <SheetContent
        dir={dir}
        side={lang === "ar" ? "left" : "right"}
        showCloseButton={false}
        className="w-[85%] gap-0 overflow-y-auto bg-background sm:max-w-sm"
      >
        <div className="flex items-center justify-end p-4">
          <SheetTitle className="sr-only">{menu.title}</SheetTitle>
          <SheetClose
            render={
              <Button variant="ghost" size="icon" className="size-10 rounded-full" />
            }
          >
            <XIcon className="size-6" strokeWidth={1.5} />
            <span className="sr-only">{menu.close}</span>
          </SheetClose>
        </div>

        <nav aria-label={nav.label} className="flex-1 px-2 pb-6">
          <Accordion>
            {nav.items.map((item) =>
              item.columns ? (
                <AccordionItem
                  key={item.label}
                  value={item.label}
                  className="border-b"
                >
                  <AccordionTrigger className="items-center px-4 py-4 text-lg font-medium hover:no-underline **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-foreground">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-4 pb-5 [&_a]:no-underline">
                    {item.columns.map((column) => (
                      <div key={column.title}>
                        <a
                          href={column.href}
                          onClick={close}
                          className="block py-1 text-[0.95rem] font-medium text-foreground"
                        >
                          {column.title}
                        </a>
                        <ul className="ps-2">
                          {column.links.map((link, i) => (
                            <li key={`${link.label}-${i}`}>
                              <a
                                href={link.href}
                                onClick={close}
                                className="block py-1.5 text-[0.95rem] text-muted-foreground hover:text-foreground"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.label} className="border-b">
                  <a
                    href={item.href}
                    onClick={close}
                    className="block px-4 py-4 text-lg font-medium"
                  >
                    {item.label}
                  </a>
                </div>
              )
            )}
          </Accordion>

          <ul className="mt-6 space-y-1 px-4">
            {topBar.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={close}
                  className="block py-2 text-[0.95rem] text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={topBar.language.href}
                hrefLang={topBar.language.lang}
                lang={topBar.language.lang}
                aria-label={`${topBar.language.label}: ${topBar.language.name}`}
                className="block py-2 text-[0.95rem] text-muted-foreground hover:text-foreground"
              >
                {topBar.language.name}
              </a>
            </li>
          </ul>

          <ul
            aria-label={topBar.brandsLabel}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 px-4 text-sm font-semibold"
          >
            {topBar.brands.map((brand) => (
              <li key={brand.label}>
                <a href={brand.href} onClick={close} className="hover:text-muted-foreground">
                  {brand.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
