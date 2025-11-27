"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Types
export interface TeamMember {
  id?: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface TeamRole {
  id: string
  name: string
  description: string
}

// Default roles
export const defaultRoles: TeamRole[] = [
  {
    id: "viewer",
    name: "Viewer",
    description: "Can view and comment.",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Can view, comment and edit.",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Can view, comment and manage billing.",
  },
  {
    id: "owner",
    name: "Owner",
    description: "Admin-level access to all resources.",
  },
]

// Context
interface TeamMembersContextValue {
  members: TeamMember[]
  roles: TeamRole[]
  onRoleChange?: (memberId: string, roleId: string) => void
  onRemove?: (memberId: string) => void
}

const TeamMembersContext = React.createContext<TeamMembersContextValue | null>(null)

export function useTeamMembersContext() {
  const context = React.useContext(TeamMembersContext)
  if (!context) {
    throw new Error("useTeamMembersContext must be used within a TeamMembers component")
  }
  return context
}

// Root Component
export interface TeamMembersProps extends React.ComponentProps<typeof Card> {
  members?: TeamMember[]
  roles?: TeamRole[]
  onRoleChange?: (memberId: string, roleId: string) => void
  onRemove?: (memberId: string) => void
  title?: string
  description?: string
  children?: React.ReactNode
}

export function TeamMembers({
  members = [],
  roles = defaultRoles,
  onRoleChange,
  onRemove,
  title,
  description,
  children,
  className,
  ...props
}: TeamMembersProps) {
  const contextValue = React.useMemo<TeamMembersContextValue>(
    () => ({
      members,
      roles,
      onRoleChange,
      onRemove,
    }),
    [members, roles, onRoleChange, onRemove]
  )

  return (
    <TeamMembersContext.Provider value={contextValue}>
      <Card
        data-slot="team-members"
        className={cn("shadow-none border", className)}
        {...props}
      >
        {(title || description) && (
          <CardHeader data-slot="team-members-header">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent data-slot="team-members-content" className="grid gap-6">
          {children ??
            members.map((member, index) => (
              <TeamMemberItem key={member.id ?? index} member={member} />
            ))}
        </CardContent>
      </Card>
    </TeamMembersContext.Provider>
  )
}

// Single Member Item
export interface TeamMemberItemProps extends React.ComponentProps<"div"> {
  member: TeamMember
}

export function TeamMemberItem({
  member,
  className,
  ...props
}: TeamMemberItemProps) {
  return (
    <div
      data-slot="team-member-item"
      className={cn(
        "flex items-center justify-between space-x-4 rtl:space-x-reverse",
        className
      )}
      {...props}
    >
      <TeamMemberInfo member={member} />
      <TeamMemberRoleSelect member={member} />
    </div>
  )
}

// Member Info (Avatar + Name + Email)
export interface TeamMemberInfoProps extends React.ComponentProps<"div"> {
  member: TeamMember
}

export function TeamMemberInfo({
  member,
  className,
  ...props
}: TeamMemberInfoProps) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div
      data-slot="team-member-info"
      className={cn("flex items-center space-x-4", className)}
      {...props}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium leading-none">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.email}</p>
      </div>
    </div>
  )
}

// Role Select Popover
export interface TeamMemberRoleSelectProps extends React.ComponentProps<typeof Popover> {
  member: TeamMember
  roles?: TeamRole[]
  onRoleChange?: (roleId: string) => void
}

export function TeamMemberRoleSelect({
  member,
  roles: rolesProp,
  onRoleChange: onRoleChangeProp,
  ...props
}: TeamMemberRoleSelectProps) {
  const context = React.useContext(TeamMembersContext)
  const roles = rolesProp ?? context?.roles ?? defaultRoles
  const onRoleChange = onRoleChangeProp ?? ((roleId: string) => {
    context?.onRoleChange?.(member.id ?? "", roleId)
  })

  const currentRole = roles.find((r) => r.id === member.role) ?? roles[0]

  return (
    <Popover {...props}>
      <PopoverTrigger asChild data-slot="team-member-role-trigger">
        <Button variant="outline" size="sm" className="ml-auto">
          {currentRole?.name ?? "Select role"}{" "}
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="team-member-role-content"
        className="p-0"
        align="end"
      >
        <Command>
          <CommandInput placeholder="Select new role..." />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup className="p-1.5">
              {roles.map((role) => (
                <CommandItem
                  key={role.id}
                  className="flex flex-col items-start px-4 py-2 space-y-1"
                  onSelect={() => onRoleChange(role.id)}
                >
                  <p>{role.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Export all components
export {
  TeamMembers as TeamMembersRoot,
  TeamMemberItem,
  TeamMemberInfo,
  TeamMemberRoleSelect,
}
