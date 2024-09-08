import { db } from "~/server/db";

const SemesterPage = async ({ params }: { params: { id: string } }) => {
  const semester = await db.semester.findUnique({
    where: { id: params.id },
  });

  return (
    <>
      <p>{semester?.name}</p>
    </>
  );
};

export default SemesterPage;
