import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import SemesterDashboard from "./SemesterDashboard";

const SemesterPage = ({ params }: { params: { id: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <Suspense>
      <SemesterDashboard userId={userId} id={params.id} />
    </Suspense>
  );
};

export default SemesterPage;
