import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

const SemesterPage = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();

  const semester = await db.semester.findUnique({
    where: { id: params.id },
  });

  if (!semester || semester.userId !== userId) {
    redirect("/not-found");
  }

  return (
    <>
      <p>{semester?.name}</p>
    </>
  );
};

export default SemesterPage;
