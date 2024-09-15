"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSemester from "~/hooks/useSemester";
import { DataTable } from "./DataTable";
import { getColumns } from "./columns";

const queryClient = new QueryClient();

const SemesterDashboard = ({ id }: { id: string }) => {
  const { userId } = useAuth();

  const { data: semester, isLoading, refetch } = useSemester({ id });

  if (!isLoading && (!semester || semester.userId !== userId)) {
    redirect("/not-found");
  }

  const refetchSync = () => void refetch();

  const columns = getColumns({
    refetch: refetchSync,
  });

  return (
    <>
      {semester && (
        <>
          <p className="text-2xl">{semester.name}</p>
          <DataTable
            columns={columns}
            data={semester.assignments}
            semesterId={semester.id}
            refetch={refetchSync}
          />
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
