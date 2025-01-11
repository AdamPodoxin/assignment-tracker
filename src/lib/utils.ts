import type { Assignment } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAssignmentsToCsv = (assignments: Assignment[]) => {
  const assignmentProperties = Object.keys(assignments[0]!).filter(
    (key) => key !== "id" && key !== "semesterId",
  );

  const headerRow = assignmentProperties.join(",");

  const rows = assignments.map((assignment) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, semesterId, ...assignmentData } = assignment;

    const values = Object.values(assignmentData).map((value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }

      return value;
    });

    return values.join(",");
  });

  return [headerRow, ...rows].join("\n");
};
