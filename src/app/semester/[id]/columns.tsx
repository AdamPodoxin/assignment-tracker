import { type Assignment } from "@prisma/client";
import type { Table, ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
  Check,
  X,
  Hourglass,
  CopyPlus,
  Filter,
} from "lucide-react";
import {
  deleteAssignment,
  changeAssignmentStatus,
} from "~/app/actions/semester";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const getColumns = ({
  table,
  courses,
  refetch,
  editAssignment,
  duplicateAssignment,
}: {
  table: Table<Assignment>;
  courses: string[];
  refetch: () => void;
  editAssignment: (id: Assignment) => void;
  duplicateAssignment: (id: Assignment) => void;
}) => {
  const columns: ColumnDef<Assignment, unknown>[] = [
    {
      accessorKey: "course",
      id: "course",
      header: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Course <Filter className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Courses</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {courses.map((course) => (
                <DropdownMenuCheckboxItem
                  key={course}
                  checked={(
                    table.getColumn("course")?.getFilterValue() as
                      | string[]
                      | undefined
                  )?.includes(course)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const selected = table
                        .getColumn("course")
                        ?.getFilterValue() as string[] | undefined;

                      if (selected) {
                        table
                          .getColumn("course")
                          ?.setFilterValue([...selected, course]);
                      } else {
                        table.getColumn("course")?.setFilterValue([course]);
                      }
                    } else {
                      const selected = table
                        .getColumn("course")
                        ?.getFilterValue() as string[] | undefined;

                      if (selected) {
                        table
                          .getColumn("course")
                          ?.setFilterValue(
                            selected.filter((c) => c !== course),
                          );
                      }
                    }
                  }}
                >
                  {course}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "name",
      id: "name",
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
      id: "dueDate",
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
      id: "status",
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
                onClick={() => {
                  duplicateAssignment(assignment);
                }}
              >
                <span className="flex">
                  <CopyPlus className="mr-2 h-4 w-4" /> Duplicate
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
