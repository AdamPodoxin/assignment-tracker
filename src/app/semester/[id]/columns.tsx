import { type Assignment } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { deleteAssignment } from "~/app/actions/semester";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const toTitleCase = (s: string) =>
  s.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );

const getColumns = ({
  refetch,
  editAssignment,
}: {
  refetch: () => void;
  editAssignment: (id: Assignment) => void;
}) => {
  const columns: ColumnDef<Assignment, unknown>[] = [
    {
      accessorKey: "course",
      header: "Course",
    },
    {
      accessorKey: "name",
      header: "Assignment",
    },
    {
      accessorKey: "dueDate",
      sortDescFirst: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dueDate = row.original.dueDate;
        return dueDate.toDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusString = status
          .toString()
          .split("_")
          .map(toTitleCase)
          .join(" ");

        switch (status) {
          case "NOT_DONE":
            return (
              <Badge className="bg-red-600 text-white">{statusString}</Badge>
            );

          case "IN_PROGRESS":
            return (
              <Badge className="bg-amber-600 text-white">{statusString}</Badge>
            );

          case "DONE":
            return (
              <Badge className="bg-green-600 text-white">{statusString}</Badge>
            );
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const assignment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => {
                  editAssignment(assignment);
                }}
              >
                <span className="flex">
                  <PencilIcon className="mr-2 h-4 w-4" /> Edit
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  await deleteAssignment({
                    assignmentId: assignment.id,
                    semesterId: assignment.semesterId,
                  });

                  refetch();
                }}
              >
                <span className="flex font-bold text-red-600">
                  <TrashIcon className="mr-2 h-4 w-4" /> Delete
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};

export default getColumns;
