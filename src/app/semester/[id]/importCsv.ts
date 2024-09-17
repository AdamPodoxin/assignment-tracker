"use client";

import { type $Enums, type Assignment } from "@prisma/client";
import { uploadAssignments } from "~/app/actions/semester";

export type ImportCsvData = {
  rows: {
    values: {
      assignment: string;
      course: string;
      dueDate: string;
      status: string;
    };
  }[];
};

export const importCsv = async ({
  data,
  semesterId,
}: {
  data: ImportCsvData;
  semesterId: string;
}) => {
  const assignments: Omit<Assignment, "id" | "semesterId">[] = data.rows.map(
    (row) => {
      const values = row.values;

      const dueDate = new Date(values.dueDate);

      return {
        name: values.assignment,
        course: values.course,
        dueDate,
        status: values.status as $Enums.Status,
      };
    },
  );

  await uploadAssignments({ assignments, semesterId });
};
