import { type Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export type SemesterWithAssignments = Prisma.SemesterGetPayload<{
  include: { assignments: true };
}>;

const useSemester = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ["semester"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch(`/api/semester?id=${id}`);

      const data = (await response.json()) as SemesterWithAssignments;

      data.assignments = data.assignments.map((a) => {
        return {
          ...a,
          dueDate: new Date(a.dueDate as unknown as string),
        };
      });

      return data;
    },
  });

  return query;
};

export default useSemester;
