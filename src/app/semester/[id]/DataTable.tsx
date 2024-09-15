"use client";

import { useState } from "react";
import { Status } from "@prisma/client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import { cn } from "~/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { addAssignment } from "~/app/actions/semester";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  semesterId,
  refetch,
}: DataTableProps<TData, TValue> & {
  semesterId: string;
  refetch: () => void;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                          semesterId,
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
}
