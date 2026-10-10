"use client";

import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { TablecnTask } from "@prisma/client";
import { useMediaQuery } from "@/components/tablecn/hooks/use-media-query";

import { deleteTasks } from "@/components/tablecn/actions/actions";

interface DeleteTasksDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tasks: Row<TablecnTask>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteTasksDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    startDeleteTransition(async () => {
      const { error } = await deleteTasks({
        ids: tasks.map((task) => task.id),
      });

      if (error) {
        toast.error(error);
        return;
      }

      onOpenChange?.(false);
      toast.success("Tasks deleted");
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {showTrigger ? (
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({tasks.length})
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{tasks.length}</span>
              {tasks.length === 1 ? " task" : " tasks"} from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <DrawerTrigger render={<Button variant="outline" size="sm" />}>
          <Trash className="mr-2 size-4" aria-hidden="true" />
          Delete ({tasks.length})
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tasks.length}</span>
            {tasks.length === 1 ? " task" : " tasks"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
