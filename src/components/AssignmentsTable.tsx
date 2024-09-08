"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { type Prisma } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AssignmentsTable = ({
  semester,
}: {
  semester: Prisma.SemesterGetPayload<{ include: { assignments: true } }>;
}) => {
  const [shouldDisplayNewAssignmentRow, setShouldDisplayNewAssignmentRow] =
    useState(false);

  const [newAssignmentDate, setNewAssignmentDate] = useState<Date>();

  return (
    <div className="w-full">
      <Button
        className="my-2"
        onClick={() => setShouldDisplayNewAssignmentRow(true)}
      >
        Add assignment
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Assignment</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {shouldDisplayNewAssignmentRow && (
            <TableRow>
              <TableCell>
                <Input placeholder="Course"></Input>
              </TableCell>
              <TableCell>
                <Input placeholder="Assignment"></Input>
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
                      onSelect={setNewAssignmentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Select>
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
                  <Button>Save</Button>
                  <Button
                    variant={"secondary"}
                    onClick={() => setShouldDisplayNewAssignmentRow(false)}
                  >
                    Cancel
                  </Button>
                </span>
              </TableCell>
            </TableRow>
          )}

          {semester.assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>{assignment.course}</TableCell>
              <TableCell>{assignment.name}</TableCell>
              <TableCell>{assignment.dueDate.toDateString()}</TableCell>
              <TableCell>{assignment.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignmentsTable;
