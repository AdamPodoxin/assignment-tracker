"use client";

import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSemester from "~/hooks/useSemester";
import { AssignmentsTable } from "./AssignmentsTable";

const queryClient = new QueryClient();

const SemesterDashboardUI = ({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) => {
  const router = useRouter();

  const { data: semester, isLoading, refetch } = useSemester({ id });

  if (!isLoading && (!semester || semester.userId !== userId)) {
    router.push("/");
  }

  return (
    <>
      {semester && (
        <>
          <p className="text-2xl">{semester.name}</p>
          <AssignmentsTable
            semester={semester}
            refetch={() => void refetch()}
          />
        </>
      )}
    </>
  );
};

const SemesterDashboard = ({ userId, id }: { userId: string; id: string }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SemesterDashboardUI userId={userId} id={id} />
    </QueryClientProvider>
  );
};

export default SemesterDashboard;
