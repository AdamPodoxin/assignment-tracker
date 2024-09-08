import { type Prisma } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const AssignmentsTable = ({
  semester,
}: {
  semester: Prisma.SemesterGetPayload<{ include: { assignments: true } }>;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
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
  );
};

export default AssignmentsTable;
