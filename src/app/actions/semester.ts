"use server";

import { auth } from "@clerk/nextjs/server";
import { type Assignment } from "@prisma/client";
import { db } from "~/server/db";

export const createSemester = async (name: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not signed in");
  }

  if (!name) {
    throw new Error("Name must not be empty");
  }

  const semesterWithNameExists =
    (await db.semester.count({
      where: { name },
    })) > 0;

  if (semesterWithNameExists) {
    throw new Error("Semester with same name already exists");
  }

  return await db.semester.create({
    data: {
      name,
      userId,
    },
  });
};

export const addAssignment = async ({
  assignment,
  semesterId,
}: {
  assignment: Omit<Assignment, "id" | "semesterId">;
  semesterId: string;
}) => {
  await db.semester.update({
    where: { id: semesterId },
    data: {
      assignments: {
        create: assignment,
      },
    },
  });
};

export const editAssignment = async ({
  semesterId,
  assignmentId,
  data,
}: {
  semesterId: string;
  assignmentId: string;
  data: Omit<Assignment, "id" | "semesterId">;
}) => {
  await db.semester.update({
    where: { id: semesterId },
    data: {
      assignments: {
        update: {
          where: { id: assignmentId },
          data: data,
        },
      },
    },
  });
};

export const deleteAssignment = async ({
  assignmentId,
  semesterId,
}: {
  assignmentId: string;
  semesterId: string;
}) => {
  await db.semester.update({
    where: { id: semesterId },
    data: {
      assignments: {
        delete: {
          id: assignmentId,
        },
      },
    },
  });
};
