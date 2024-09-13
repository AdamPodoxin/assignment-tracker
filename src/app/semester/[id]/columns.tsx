import { type Assignment } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Assignment>[] = [
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
];
