import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionDemo() {
  return (
    <>
      <Accordion className="w-full" defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Product Information</AccordionTrigger>
          <AccordionContent>
            Our flagship product combines cutting-edge technology with sleek
            design.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Shipping Details</AccordionTrigger>
          <AccordionContent>
            We offer worldwide shipping through trusted courier partners.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Return Policy</AccordionTrigger>
          <AccordionContent>
            We stand behind our products with a comprehensive 30-day return
            policy.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
