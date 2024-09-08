import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export const POST = async (request: Request) => {
  const authObject = auth();
  const userId = authObject.userId ?? "";

  const { name } = (await request.json()) as { name: string };

  const semester = await db.semester.create({
    data: {
      name,
      userId,
    },
  });

  return new NextResponse(JSON.stringify(semester));
};
