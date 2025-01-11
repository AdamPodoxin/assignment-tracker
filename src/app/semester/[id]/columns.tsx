import { type Assignment } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
  Check,
  X,
  Hourglass,
} from "lucide-react";
import {
  deleteAssignment,
  changeAssignmentStatus,
} from "~/app/actions/semester";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

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
      cell: ({ row }) => {
        if (row.original.link) {
          return (
            <a
              href={row.original.link}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {row.original.name}
            </a>
          );
        } else {
          return row.original.name;
        }
      },
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
        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              className={`px-1 hover:bg-green-500 ${status === "DONE" ? "bg-green-600" : ""}`}
              onClick={async () => {
                if (status === "DONE") return;

                await changeAssignmentStatus({
                  id: row.original.id,
                  status: "DONE",
                });
                refetch();
              }}
            >
              <Check className="w-8" />
            </Button>
            <Button
              variant="outline"
              className={`px-1 ${status === "IN_PROGRESS" ? "bg-amber-600" : ""}`}
              onClick={async () => {
                if (status === "IN_PROGRESS") return;

                await changeAssignmentStatus({
                  id: row.original.id,
                  status: "IN_PROGRESS",
                });
                refetch();
              }}
            >
              <Hourglass className="w-8" />
            </Button>
            <Button
              variant="outline"
              className={`px-1 ${status === "NOT_DONE" ? "bg-red-600" : ""}`}
              onClick={async () => {
                if (status === "NOT_DONE") return;

                await changeAssignmentStatus({
                  id: row.original.id,
                  status: "NOT_DONE",
                });
                refetch();
              }}
            >
              <X className="w-8" />
            </Button>
          </div>
        );
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
