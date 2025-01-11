"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import type { $Enums, Assignment } from "@prisma/client";

export const getSemesters = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not signed in");
  }

  return await db.semester.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          assignments: true,
        },
      },
    },
    orderBy: {
      creationDateTime: "desc",
    },
  });
};

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

export const deleteSemester = async (id: string) => {
  await db.semester.delete({
    where: {
      id,
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

export const uploadAssignments = async ({
  assignments,
  semesterId,
}: {
  assignments: Omit<Assignment, "id" | "semesterId">[];
  semesterId: string;
}) => {
  await db.semester.update({
    where: { id: semesterId },
    data: {
      assignments: {
        createMany: {
          data: assignments,
        },
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

export const changeAssignmentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: $Enums.Status;
}) => {
  await db.assignment.update({
    where: { id },
    data: {
      status,
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
