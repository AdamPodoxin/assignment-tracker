import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

const SemesterPage = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();

  const semester = await db.semester.findUnique({
    where: { id: params.id },
    include: { assignments: true },
  });

  if (!semester || semester.userId !== userId) {
    redirect("/not-found");
  }

  return (
    <>
      <p className="text-2xl">{semester.name}</p>
    </>
  );
};

export default SemesterPage;
