'use client'

import { Folder, File } from 'lucide-react'

interface DirectoryNode {
  name: string
  type: 'file' | 'directory'
  description?: string
  children?: DirectoryNode[]
}

interface StructureProps {
  className?: string
}

export function Structure({ className }: StructureProps) {
  const topLevelStructure: DirectoryNode = {
    name: "src/",
    type: "directory",
    description: "Source code directory",
    children: [
      {
        name: "app/",
        type: "directory",
        description: "Next.js App Router",
        children: [
          {
            name: "api/",
            type: "directory",
            description: "API routes",
            children: [
              { name: "auth/", type: "directory", description: "Authentication endpoints" },
              { name: "classes/", type: "directory", description: "Class management" },
              { name: "students/", type: "directory", description: "Student endpoints" },
              { name: "teachers/", type: "directory", description: "Teacher endpoints" },
              { name: "timetable/", type: "directory", description: "Timetable API" },
              { name: "webhooks/", type: "directory", description: "External webhooks" }
            ]
          },
          {
            name: "[lang]/",
            type: "directory",
            description: "Internationalized routes",
            children: [
              {
                name: "(auth)/",
                type: "directory",
                description: "Authentication pages",
                children: [
                  { name: "login/", type: "directory" },
                  { name: "join/", type: "directory" },
                  { name: "reset/", type: "directory" },
                  { name: "new-verification/", type: "directory" }
                ]
              },
              {
                name: "(marketing)/",
                type: "directory",
                description: "Entry point 01: SaaS marketing",
                children: [
                  { name: "blog/", type: "directory" },
                  { name: "docs/", type: "directory" },
                  { name: "features/", type: "directory" }
                ]
              },
              {
                name: "(operator)/",
                type: "directory",
                description: "Entry point 02: SaaS dashboard",
                children: [
                  { name: "dashboard/", type: "directory" },
                  { name: "analytics/", type: "directory" },
                  { name: "billing/", type: "directory" },
                  { name: "tenants/", type: "directory" },
                  { name: "domains/", type: "directory" }
                ]
              },
              {
                name: "onboarding/",
                type: "directory",
                description: "User onboarding flow"
              },
              {
                name: "s/",
                type: "directory",
                description: "Multi-tenant routing",
                children: [
                  {
                    name: "[subdomain]/",
                    type: "directory",
                    description: "Tenant-specific routes",
                    children: [
                      {
                        name: "(site)/",
                        type: "directory",
                        description: "Entry point 03: School marketing"
                      },
                      {
                        name: "(platform)/",
                        type: "directory",
                        description: "Entry point 04: School dashboard",
                        children: [
                          { name: "dashboard/", type: "directory" },
                          { name: "attendance/", type: "directory" },
                          { name: "classes/", type: "directory" },
                          { name: "students/", type: "directory" },
                          { name: "teachers/", type: "directory" },
                          { name: "exams/", type: "directory" },
                          { name: "timetable/", type: "directory" },
                          { name: "billing/", type: "directory" },
                          { name: "admin/", type: "directory" }
                        ]
                      }
                    ]
                  }
                ]
              },
              { name: "layout.tsx", type: "file", description: "Root layout component" }
            ]
          }
        ]
      },
      {
        name: "components/",
        type: "directory",
        description: "React components (mirrors app/)",
        children: [
          { name: "ui/", type: "directory", description: "shadcn/ui primitives" },
          {
            name: "atom/",
            type: "directory",
            description: "Complex components (2+ shadcn)",
            children: [
              { name: "modal/", type: "directory" },
              { name: "lab/", type: "directory" }
            ]
          },
          {
            name: "template/",
            type: "directory",
            description: "Full sections",
            children: [
              { name: "marketing-header/", type: "directory" },
              { name: "marketing-footer/", type: "directory" },
              { name: "dashboard-header/", type: "directory" },
              { name: "dashboard-sidebar/", type: "directory" },
              { name: "platform-header/", type: "directory" },
              { name: "platform-sidebar/", type: "directory" }
            ]
          },
          { name: "auth/", type: "directory", description: "Authentication components" },
          { name: "onboarding/", type: "directory", description: "Onboarding components" },
          { name: "marketing/", type: "directory", description: "Entry point 01 components" },
          {
            name: "operator/",
            type: "directory",
            description: "Entry point 02 components",
            children: [
              { name: "dashboard/", type: "directory" },
              { name: "analytics/", type: "directory" },
              { name: "billing/", type: "directory" },
              { name: "tenants/", type: "directory" }
            ]
          },
          { name: "site/", type: "directory", description: "Entry point 03 components" },
          {
            name: "platform/",
            type: "directory",
            description: "Entry point 04 components",
            children: [
              { name: "dashboard/", type: "directory" },
              { name: "attendance/", type: "directory" },
              { name: "classes/", type: "directory" },
              { name: "students/", type: "directory" },
              { name: "teachers/", type: "directory" },
              { name: "exams/", type: "directory" },
              { name: "timetable/", type: "directory" },
              { name: "billing/", type: "directory" },
              { name: "admin/", type: "directory" }
            ]
          }
        ]
      },
      { name: "lib/", type: "directory", description: "Shared utilities" },
      { name: "hooks/", type: "directory", description: "Custom React hooks" },
      { name: "store/", type: "directory", description: "State management" },
      { name: "styles/", type: "directory", description: "CSS/styling" },
      { name: "types/", type: "directory", description: "TypeScript definitions" }
    ]
  }

  const FileIcon = ({ type }: { type: string }) => {
    if (type === "directory") {
      return <Folder className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const FileTree = ({
    item,
    level = 0,
    isLast = false,
    parentIsLast = []
  }: {
    item: DirectoryNode
    level?: number
    isLast?: boolean
    parentIsLast?: boolean[]
  }) => (
    <div className="relative">
      {level > 0 && (
        <>
          {parentIsLast.slice(0, -1).map((isLastParent, idx) => (
            !isLastParent && (
              <div
                key={idx}
                className="absolute border-l h-full"
                style={{ left: `${(idx + 1) * 24 - 20}px` }}
              />
            )
          ))}
          {!isLast && (
            <div
              className="absolute border-l h-full"
              style={{ left: `${level * 24 - 20}px` }}
            />
          )}
        </>
      )}
      <div
        className="flex items-center gap-2 py-1"
        style={{ paddingLeft: `${level * 24}px` }}
      >
        <FileIcon type={item.type} />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <code className={`bg-transparent px-0 py-0 ${
            item.type === 'directory' ? 'font-semibold' : ''
          }`}>
            {item.name}
          </code>
          {item.description && (
            <span className="text-sm text-muted-foreground">
              — {item.description}
            </span>
          )}
        </div>
      </div>
      {item.children && (
        <div className="mt-1">
          {item.children.map((child: DirectoryNode, index: number) => (
            <FileTree
              key={index}
              item={child}
              level={level + 1}
              isLast={index === (item.children?.length ?? 0) - 1}
              parentIsLast={[...parentIsLast, isLast]}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="py-4">
        <FileTree item={topLevelStructure} />
      </div>
    </div>
  )
}
