"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { type Assignment, Status } from "@prisma/client";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { addAssignment, deleteAssignment } from "~/app/actions/semester";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  ArrowUpDown,
  CalendarIcon,
  FilterIcon,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { type SemesterWithAssignments } from "~/hooks/useSemester";
import FilterDropdown from "./FilterDropdown";

const toTitleCase = (s: string) =>
  s.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );

export const AssignmentsTable = ({
  semester,
  refetch,
}: {
  semester: SemesterWithAssignments;
  refetch: () => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "dueDate", desc: false },
  ]);

  const columns = useMemo<ColumnDef<Assignment, unknown>[]>(
    () => [
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
        header: ({ column }) => {
          return (
            <Button variant="ghost">
              <span className="flex">
                Status
                <FilterIcon className="ml-2 h-4 w-4" />
              </span>
            </Button>
          );
        },
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
                <Badge className="bg-amber-600 text-white">
                  {statusString}
                </Badge>
              );

            case "DONE":
              return (
                <Badge className="bg-green-600 text-white">
                  {statusString}
                </Badge>
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
    ],
    [],
  );

  const table = useReactTable<Assignment>({
    data: semester.assignments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  const [isNewAssignmentRowVisible, setIsNewAssignmentRowVisible] =
    useState(false);

  const [newAssignmentCourse, setNewAssignmentCourse] = useState("");
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentDate, setNewAssignmentDate] = useState(new Date());
  const [newAssignmentStatus, setNewAssignmentStatus] = useState<Status>(
    Status.NOT_DONE,
  );

  return (
    <div className="w-full">
      <Button
        className="my-2"
        onClick={() => setIsNewAssignmentRowVisible(true)}
      >
        Add assignment
      </Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isNewAssignmentRowVisible && (
              <TableRow>
                <TableCell>
                  <Input
                    placeholder="Course"
                    value={newAssignmentCourse}
                    onChange={(e) => setNewAssignmentCourse(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Assignment"
                    value={newAssignmentName}
                    onChange={(e) => setNewAssignmentName(e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !newAssignmentDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newAssignmentDate ? (
                          format(newAssignmentDate, "PPP")
                        ) : (
                          <span>Due date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newAssignmentDate}
                        onSelect={(e) => setNewAssignmentDate(e ?? new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(v) => setNewAssignmentStatus(v as Status)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="NOT_DONE">NOT DONE</SelectItem>
                        <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                        <SelectItem value="DONE">DONE</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className="flex gap-2">
                    <Button
                      onClick={async () => {
                        setIsNewAssignmentRowVisible(false);

                        await addAssignment({
                          assignment: {
                            course: newAssignmentCourse,
                            name: newAssignmentName,
                            dueDate: newAssignmentDate,
                            status: newAssignmentStatus,
                          },
                          semesterId: semester.id,
                        });

                        refetch();
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => setIsNewAssignmentRowVisible(false)}
                    >
                      Cancel
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            )}

            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
