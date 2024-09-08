import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import AssignmentsTable from "~/components/AssignmentsTable";

const SemesterPage = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();

  const semester = await db.semester.findUnique({
    where: { id: params.id },
    include: { assignments: true },
  });

  if (!semester || semester.userId !== userId) {
    redirect("/not-found");
  }

  semester.assignments.push({
    id: "id",
    course: "CMPT 201",
    name: "A0",
    dueDate: new Date(),
    status: "DONE",
    semesterId: semester.id,
  });

  return (
    <>
      <p className="text-2xl">{semester.name}</p>

      <AssignmentsTable semester={semester} />
    </>
  );
};

export default SemesterPage;
