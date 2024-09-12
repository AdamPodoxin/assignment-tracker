import { type NextRequest } from "next/server";
import { db } from "~/server/db";

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return new Response("Bad Request", {
      status: 400,
      statusText: "'id' should not be null",
    });
  }

  const semester = await db.semester.findUnique({
    where: {
      id,
    },
    include: { assignments: true },
  });

  if (!semester) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  return Response.json(semester);
};
