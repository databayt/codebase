"use client"

import * as React from "react"
import type { getDictionary } from "@/components/local/dictionaries"

import {
  TeamMembers,
  TeamMemberItem,
  type TeamMember,
} from "./team-member"

// Demo data
const demoMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sofia Davis",
    email: "m@example.com",
    avatar: "/avatars/01.png",
    role: "owner",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "p@example.com",
    avatar: "/avatars/02.png",
    role: "developer",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "i@example.com",
    avatar: "/avatars/03.png",
    role: "viewer",
  },
]

interface CardsTeamMembersProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsTeamMembers({ dictionary }: CardsTeamMembersProps) {
  const [members, setMembers] = React.useState<TeamMember[]>(demoMembers)

  const handleRoleChange = (memberId: string, roleId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: roleId } : m))
    )
  }

  return (
    <TeamMembers
      members={members}
      onRoleChange={handleRoleChange}
      title={dictionary?.cards?.teamMembers?.title || "Team Members"}
      description={
        dictionary?.cards?.teamMembers?.description ||
        "Invite your team members to collaborate."
      }
    >
      {members.map((member) => (
        <TeamMemberItem key={member.id} member={member} />
      ))}
    </TeamMembers>
  )
}
