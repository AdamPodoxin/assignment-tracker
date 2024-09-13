"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSemester from "~/hooks/useSemester";
import AssignmentsTable from "~/components/AssignmentsTable";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const queryClient = new QueryClient();

const SemesterDashboard = ({ id }: { id: string }) => {
  const { userId } = useAuth();

  const { data: semester, isLoading, refetch } = useSemester({ id });

  if (!isLoading && (!semester || semester.userId !== userId)) {
    redirect("/not-found");
  }

  return (
    <>
      {semester && (
        <>
          <p className="text-2xl">{semester.name}</p>
          <AssignmentsTable semester={semester} onAdd={refetch} />
          <DataTable columns={columns} data={semester.assignments} />
        </>
      )}
    </>
  );
};

const SemesterPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {<SemesterDashboard id={params.id} />}
      </QueryClientProvider>
    </>
  );
};

export default SemesterPage;
