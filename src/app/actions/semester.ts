"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export const createSemester = async (name: string) => {
  const authObject = auth();
  const userId = authObject.userId ?? "";

  return await db.semester.create({
    data: {
      name,
      userId,
    },
  });
};
