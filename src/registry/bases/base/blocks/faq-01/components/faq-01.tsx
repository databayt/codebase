import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export type FaqItem = {
  question: string
  answer: string
  /** Optional bullet list under the answer. */
  list?: string[]
}

export type FaqDictionary = {
  eyebrow: string
  title: string
  subtitle: string
  items: FaqItem[]
  contact: {
    text: string
    linkLabel: string
    href: string
  }
}

export function Faq({
  dictionary,
  lang,
  className,
}: {
  dictionary: FaqDictionary
  lang: "en" | "ar"
  className?: string
}) {
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <section
      dir={dir}
      aria-labelledby="faq-01-title"
      className={cn("bg-background py-16 md:py-24", className)}
    >
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
        <div className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
          <p className="text-sm font-medium text-primary">{dictionary.eyebrow}</p>
          <h2
            id="faq-01-title"
            className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl"
          >
            {dictionary.title}
          </h2>
          <p className="max-w-xl text-base text-balance text-muted-foreground md:text-lg">
            {dictionary.subtitle}
          </p>
        </div>

        {/* One open at a time (Base UI's default), all closed initially. */}
        <Accordion className="gap-3.5">
          {dictionary.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-3xl bg-muted/50 transition-colors duration-300 not-last:border-b-0 hover:bg-muted/70 data-open:bg-muted"
            >
              <AccordionTrigger className="items-center gap-4 rounded-3xl px-6 py-5 text-lg font-medium tracking-tight hover:no-underline md:px-8 md:py-6 md:text-xl **:data-[slot=accordion-trigger-icon]:size-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-base leading-relaxed text-muted-foreground md:px-8 md:pb-7 md:text-lg">
                <p>{item.answer}</p>
                {item.list && item.list.length > 0 && (
                  <ul className="list-outside list-disc space-y-2 ps-5">
                    {item.list.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-10 text-center text-sm text-muted-foreground md:text-base">
          {dictionary.contact.text}{" "}
          <a
            href={dictionary.contact.href}
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            {dictionary.contact.linkLabel}
          </a>
        </p>
      </div>
    </section>
  )
}
