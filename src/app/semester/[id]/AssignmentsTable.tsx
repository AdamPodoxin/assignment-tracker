"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CalendarIcon, DownloadIcon, FileIcon, PlusIcon } from "lucide-react";
import type { Assignment, Status } from "@prisma/client";
import {
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn, convertAssignmentsToCsv } from "~/lib/utils";
import {
  addAssignment,
  editAssignment,
  getAssignmentsBySemester,
} from "~/app/actions/semester";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { type SemesterWithAssignments } from "~/hooks/useSemester";
import getColumns from "./columns";

export const AssignmentsTable = ({
  semester,
  refetch,
}: {
  semester: SemesterWithAssignments;
  refetch: () => void;
}) => {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "dueDate", desc: false },
  ]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState("");
  const [editingAssignmentStatus, setEditingAssignmentStatus] =
    useState<Status>("NOT_DONE");

  const columns = useMemo(
    () =>
      getColumns({
        refetch,
        editAssignment: (assignment) => {
          setIsEditing(true);

          setEditingAssignmentId(assignment.id);
          setNewAssignmentName(assignment.name);
          setNewAssignmentCourse(assignment.course);
          setNewAssignmentDate(assignment.dueDate);
          setEditingAssignmentStatus(assignment.status);

          setIsDialogOpen(true);
        },
        duplicateAssignment: (assignment) => {
          setIsEditing(false);

          setNewAssignmentCourse(assignment.course);
          setNewAssignmentName(assignment.name);
          setNewAssignmentLink(assignment.link ?? "");
          setNewAssignmentDate(assignment.dueDate);

          setIsDialogOpen(true);
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

  const [newAssignmentCourse, setNewAssignmentCourse] = useState("");
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentLink, setNewAssignmentLink] = useState("");
  const [newAssignmentDate, setNewAssignmentDate] = useState(new Date());

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="flex gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)} className="my-2">
              <span className="flex items-center">
                <PlusIcon className="mr-2 h-4 w-4" /> Add assignment
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit" : "New"} Assignment</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Course"
                value={newAssignmentCourse}
                onChange={(e) => setNewAssignmentCourse(e.target.value)}
              />
              <Input
                placeholder="Name"
                value={newAssignmentName}
                onChange={(e) => setNewAssignmentName(e.target.value)}
              />
              <Input
                placeholder="Link"
                value={newAssignmentLink}
                onChange={(e) => setNewAssignmentLink(e.target.value)}
              />
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={async () => {
                    if (isEditing) {
                      await editAssignment({
                        semesterId: semester.id,
                        assignmentId: editingAssignmentId,
                        data: {
                          course: newAssignmentCourse,
                          name: newAssignmentName,
                          link: newAssignmentLink,
                          dueDate: newAssignmentDate,
                          status: editingAssignmentStatus,
                        },
                      });
                    } else {
                      await addAssignment({
                        assignment: {
                          course: newAssignmentCourse,
                          name: newAssignmentName,
                          dueDate: newAssignmentDate,
                          status: "NOT_DONE",
                          link: newAssignmentLink || null,
                        },
                        semesterId: semester.id,
                      });
                    }

                    refetch();
                  }}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant={"secondary"}
          className="my-2"
          onClick={() => router.push(`/semester/${semester.id}/import`)}
        >
          <span className="flex items-center">
            <FileIcon className="mr-2 h-4 w-4" /> Import CSV
          </span>
        </Button>

        <Button
          variant={"secondary"}
          className="my-2"
          onClick={async () => {
            const assignments = await getAssignmentsBySemester(semester.id);

            const csv = convertAssignmentsToCsv(assignments);
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("hidden", "");
            a.setAttribute("href", url);
            a.setAttribute("download", "assignments.csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          <span className="flex items-center">
            <DownloadIcon className="mr-2 h-4 w-4" /> Export CSV
          </span>
        </Button>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // if (row.original.id === editingAssignmentId) {
                //   return (
                //     <TableRow key={row.original.id}>
                //       <TableCell>
                //         <Input
                //           placeholder="Course"
                //           value={editingAssignmentCourse}
                //           onChange={(e) =>
                //             setEditingAssignmentCourse(e.target.value)
                //           }
                //         />
                //       </TableCell>
                //       <TableCell>
                //         <Input
                //           placeholder="Assignment"
                //           value={editingAssignmentName}
                //           onChange={(e) =>
                //             setEditingAssignmentName(e.target.value)
                //           }
                //         />
                //       </TableCell>
                //       <TableCell>
                //         <Popover>
                //           <PopoverTrigger asChild>
                //             <Button
                //               variant={"outline"}
                //               className={cn(
                //                 "w-[280px] justify-start text-left font-normal",
                //                 !editingAssignmentDate &&
                //                   "text-muted-foreground",
                //               )}
                //             >
                //               <CalendarIcon className="mr-2 h-4 w-4" />
                //               {editingAssignmentDate ? (
                //                 format(editingAssignmentDate, "PPP")
                //               ) : (
                //                 <span>Due date</span>
                //               )}
                //             </Button>
                //           </PopoverTrigger>
                //           <PopoverContent className="w-auto p-0">
                //             <Calendar
                //               mode="single"
                //               selected={editingAssignmentDate}
                //               onSelect={(e) =>
                //                 setEditingAssignmentDate(e ?? new Date())
                //               }
                //               initialFocus
                //             />
                //           </PopoverContent>
                //         </Popover>
                //       </TableCell>
                //       <TableCell>
                //         <Select
                //           value={editingAssignmentStatus}
                //           onValueChange={(v) =>
                //             setEditingAssignmentStatus(v as Status)
                //           }
                //         >
                //           <SelectTrigger>
                //             <SelectValue placeholder="Status" />
                //           </SelectTrigger>
                //           <SelectContent>
                //             <SelectGroup>
                //               <SelectLabel>Status</SelectLabel>
                //               <SelectItem value="NOT_DONE">NOT DONE</SelectItem>
                //               <SelectItem value="IN_PROGRESS">
                //                 IN PROGRESS
                //               </SelectItem>
                //               <SelectItem value="DONE">DONE</SelectItem>
                //             </SelectGroup>
                //           </SelectContent>
                //         </Select>
                //       </TableCell>
                //       <TableCell>
                //         <span className="flex gap-2">
                //           <Button
                //             onClick={async () => {
                //               setEditingAssignmentId("");

                //               await editAssignment({
                //                 semesterId: semester.id,
                //                 assignmentId: editingAssignmentId,
                //                 data: {
                //                   course: editingAssignmentCourse,
                //                   name: editingAssignmentName,
                //                   dueDate: editingAssignmentDate,
                //                   status: editingAssignmentStatus,
                //                   link: null,
                //                 },
                //               });

                //               refetch();
                //             }}
                //           >
                //             Save
                //           </Button>
                //           <Button
                //             variant={"secondary"}
                //             onClick={() => setEditingAssignmentId("")}
                //           >
                //             Cancel
                //           </Button>
                //         </span>
                //       </TableCell>
                //     </TableRow>
                //   );
                // }

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
