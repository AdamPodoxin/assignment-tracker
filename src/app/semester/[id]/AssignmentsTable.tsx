"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CSVImporter } from "csv-import-react";
import { type Assignment, Status } from "@prisma/client";
import {
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { addAssignment, editAssignment } from "~/app/actions/semester";
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
import { CalendarIcon, FileIcon, PlusIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { type SemesterWithAssignments } from "~/hooks/useSemester";
import getColumns from "./columns";
import { importCsv, type ImportCsvData } from "./importCsv";

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

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [editingAssignmentId, setEditingAssignmentId] = useState("");
  const [editingAssignmentName, setEditingAssignmentName] = useState("");
  const [editingAssignmentCourse, setEditingAssignmentCourse] = useState("");
  const [editingAssignmentDate, setEditingAssignmentDate] = useState(
    new Date(),
  );
  const [editingAssignmentStatus, setEditingAssignmentStatus] =
    useState<Status>(Status.NOT_DONE);

  const columns = useMemo(
    () =>
      getColumns({
        refetch,
        editAssignment: (assignment) => {
          setEditingAssignmentId(assignment.id);
          setEditingAssignmentName(assignment.name);
          setEditingAssignmentCourse(assignment.course);
          setEditingAssignmentDate(assignment.dueDate);
          setEditingAssignmentStatus(assignment.status);
        },
      }),
    [refetch],
  );

  const table = useReactTable<Assignment>({
    data: semester.assignments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
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

  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="flex gap-2">
        <Button
          className="my-2"
          onClick={() => setIsNewAssignmentRowVisible(true)}
        >
          <span className="flex items-center">
            <PlusIcon className="mr-2 h-4 w-4" /> Add assignment
          </span>
        </Button>

        <Button
          variant={"secondary"}
          className="my-2"
          onClick={() => setIsCsvImportOpen(true)}
        >
          <span className="flex items-center">
            <FileIcon className="mr-2 h-4 w-4" /> Import CSV
          </span>
        </Button>

        <CSVImporter
          modalIsOpen={isCsvImportOpen}
          modalOnCloseTriggered={() => setIsCsvImportOpen(false)}
          darkMode={true}
          onComplete={async (data) => {
            await importCsv({
              data: data as ImportCsvData,
              semesterId: semester.id,
            });

            refetch();
          }}
          template={{
            columns: [
              {
                name: "Course",
                key: "course",
                required: true,
              },
              {
                name: "Assignment",
                key: "assignment",
                required: true,
              },
              {
                name: "Due Date",
                key: "dueDate",
                required: true,
              },
              {
                name: "Status",
                key: "status",
                required: true,
              },
            ],
          }}
        />
      </span>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
              table.getRowModel().rows.map((row) => {
                if (row.original.id === editingAssignmentId) {
                  return (
                    <TableRow key={row.original.id}>
                      <TableCell>
                        <Input
                          placeholder="Course"
                          value={editingAssignmentCourse}
                          onChange={(e) =>
                            setEditingAssignmentCourse(e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Assignment"
                          value={editingAssignmentName}
                          onChange={(e) =>
                            setEditingAssignmentName(e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !editingAssignmentDate &&
                                  "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editingAssignmentDate ? (
                                format(editingAssignmentDate, "PPP")
                              ) : (
                                <span>Due date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={editingAssignmentDate}
                              onSelect={(e) =>
                                setEditingAssignmentDate(e ?? new Date())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editingAssignmentStatus}
                          onValueChange={(v) =>
                            setEditingAssignmentStatus(v as Status)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="NOT_DONE">NOT DONE</SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                IN PROGRESS
                              </SelectItem>
                              <SelectItem value="DONE">DONE</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <span className="flex gap-2">
                          <Button
                            onClick={async () => {
                              setEditingAssignmentId("");

                              await editAssignment({
                                semesterId: semester.id,
                                assignmentId: editingAssignmentId,
                                data: {
                                  course: editingAssignmentCourse,
                                  name: editingAssignmentName,
                                  dueDate: editingAssignmentDate,
                                  status: editingAssignmentStatus,
                                },
                              });

                              refetch();
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant={"secondary"}
                            onClick={() => setEditingAssignmentId("")}
                          >
                            Cancel
                          </Button>
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
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
                );
              })
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
