import { type Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker built using the components.",
}

const tasks = [
  {
    id: "TASK-8782",
    title: "You can't compress the program without quantifying the open-source SSD pixel!",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "TASK-7878",
    title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
    status: "Backlog",
    priority: "Low",
  },
  {
    id: "TASK-7839",
    title: "We need to bypass the neural TCP card!",
    status: "Todo",
    priority: "High",
  },
  {
    id: "TASK-5562",
    title: "The SAS interface is down, bypass the open-source sensor so we can get the HDD protocol!",
    status: "Done",
    priority: "Medium",
  },
  {
    id: "TASK-8686",
    title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
    status: "Canceled",
    priority: "Low",
  },
]

export default function TasksPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/images/tasks-light.png"
          width={1280}
          height={998}
          alt="Tasks"
          className="block dark:hidden"
        />
        <Image
          src="/images/tasks-dark.png"
          width={1280}
          height={998}
          alt="Tasks"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage your tasks and track progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">{task.id}</span>
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.status === "Done" ? "default" : "secondary"}>
                      {task.status}
                    </Badge>
                    <Badge variant="outline">{task.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
