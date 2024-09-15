import { MoreHorizontal } from "lucide-react";
import { type Assignment } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { deleteAssignment } from "~/app/actions/semester";

export const getColumns = ({ refetch }: { refetch: () => void }) => {
  const columns: ColumnDef<Assignment>[] = [
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
      header: "Due Date",
      cell: ({ row }) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const dueDate = row.getValue("dueDate") as Date;
        return dueDate.toDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
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
                onClick={async () => {
                  await deleteAssignment({
                    assignmentId: assignment.id,
                    semesterId: assignment.semesterId,
                  });

                  refetch();
                }}
              >
                <span className="font-bold text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
