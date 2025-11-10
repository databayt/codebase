import { atomsConfig } from "@/components/template/sidebar-01/atoms-config"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

/**
 * Get all atom slugs from the atoms configuration
 */
export function getAllAtomSlugs() {
  return atomsConfig.sidebarNav.flatMap(section =>
    section.items.map(item => ({
      slug: item.href.replace('/atoms/', '').split('/'),
      title: item.title,
      href: item.href,
    }))
  )
}

/**
 * Find previous and next atoms for navigation
 */
export function findAtomNeighbours(currentHref: string) {
  const allAtoms = atomsConfig.sidebarNav.flatMap(s => s.items)
  const currentIndex = allAtoms.findIndex(a => a.href === currentHref)

  return {
    previous: currentIndex > 0 ? allAtoms[currentIndex - 1] : null,
    next: currentIndex < allAtoms.length - 1 ? allAtoms[currentIndex + 1] : null,
  }
}

/**
 * Get atom metadata from MDX frontmatter
 */
export async function getAtomMetadata(slug: string[]) {
  const atomPath = slug.join('/')
  const mdxPath = path.join(process.cwd(), 'content/atoms', `${atomPath}.mdx`)

  try {
    if (!fs.existsSync(mdxPath)) {
      return null
    }

    const mdxSource = fs.readFileSync(mdxPath, 'utf8')
    const { data, content } = matter(mdxSource)

    return {
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || [],
      publishedAt: data.publishedAt || null,
      updatedAt: data.updatedAt || null,
      featured: data.featured || false,
      content,
      frontmatter: data,
    }
  } catch (error) {
    console.error(`Error reading atom metadata for ${atomPath}:`, error)
    return null
  }
}

/**
 * Extract table of contents from MDX content
 */
export function extractToc(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: { title: string; url: string; depth: number }[] = []

  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length
    const title = match[2].trim()
    const url = `#${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

    toc.push({ title, url, depth })
  }

  return toc
}

/**
 * Generate static params for all atoms
 */
export function generateAtomsStaticParams() {
  return getAllAtomSlugs().map(atom => ({
    slug: atom.slug,
  }))
}
