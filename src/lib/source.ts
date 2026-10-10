import { docs, docsArabic, atoms } from "@/.source"
import { loader } from "fumadocs-core/source"

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})

export const docsArabicSource = loader({
  baseUrl: "/docs",
  source: docsArabic.toFumadocsSource(),
})

export const atomsSource = loader({
  baseUrl: "/atoms",
  source: atoms.toFumadocsSource(),
})
