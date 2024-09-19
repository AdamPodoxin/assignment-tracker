"use client";

import { useQuery } from "@tanstack/react-query";
import { getSemesters } from "~/app/actions/semester";

const useHomePage = () => {
  const query = useQuery({
    queryKey: ["semesters"],
    refetchOnWindowFocus: false,
    queryFn: async () => await getSemesters(),
  });

  return query;
};

export default useHomePage;
