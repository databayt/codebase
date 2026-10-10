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
  /** Optional list of links under the answer (docs, contact...). */
  links?: { label: string; href: string }[]
}

export type FaqDictionary = {
  /** Use "\n" to break the heading into lines on large screens. */
  title: string
  subtitle: string
  items: FaqItem[]
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
      aria-labelledby="faq-02-title"
      className={cn("bg-background py-16 md:py-32", className)}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-y-12 px-4 md:px-6 lg:grid-cols-[1fr_2fr] lg:gap-x-16">
        <div className="text-center lg:text-start">
          <h2
            id="faq-02-title"
            className="mb-4 font-heading text-4xl font-extrabold tracking-tight text-balance md:text-5xl lg:whitespace-pre-line"
          >
            {dictionary.title}
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            {dictionary.subtitle}
          </p>
        </div>

        <Accordion
          defaultValue={["faq-0"]}
          className="w-full sm:mx-auto sm:max-w-xl lg:ms-auto lg:me-0 lg:max-w-none"
        >
          {dictionary.items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="py-5 text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base text-muted-foreground">
                <p>{item.answer}</p>
                {item.links && item.links.length > 0 && (
                  <ul className="list-outside list-disc space-y-2 ps-5">
                    {item.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
