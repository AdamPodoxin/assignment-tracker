"use client";

import { ArrowRight, TrashIcon } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useHomePage from "~/hooks/useHomePage";
import NewSemesterDialog from "~/components/NewSemesterDialog";
import { Button } from "~/components/ui/button";
import { Table, TableCell, TableRow } from "~/components/ui/table";
import { deleteSemester } from "./actions/semester";

const queryClient = new QueryClient();

const HomeDashboard = () => {
  const { data: semesters, refetch } = useHomePage();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <h1 className="text-2xl">Assignment Tracker</h1>

        <SignedOut>
          <Button asChild>
            <SignInButton />
          </Button>
        </SignedOut>

        <SignedIn>
          <Button asChild>
            <SignOutButton />
          </Button>

          <h1 className="my-4 text-xl">Semesters:</h1>
          <NewSemesterDialog />

          {semesters && (
            <div>
              <Table>
                {semesters.map((semester) => {
                  return (
                    <TableRow key={semester.id}>
                      <TableCell className="font-bold">
                        {semester.name}
                      </TableCell>

                      <TableCell>
                        {semester._count.assignments} assignments
                      </TableCell>

                      <TableCell className="flex gap-2">
                        <Button
                          asChild
                          variant={"outline"}
                          className="h-[50px] w-[50px]"
                        >
                          <a
                            href={`/semester/${semester.id}`}
                            key={semester.id}
                          >
                            <ArrowRight />
                          </a>
                        </Button>

                        <Button
                          variant={"destructive"}
                          className="h-[50px] w-[50px]"
                          onClick={async () => {
                            await deleteSemester(semester.id);
                            await refetch();
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </div>
          )}
        </SignedIn>
      </QueryClientProvider>
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HomeDashboard />
      </QueryClientProvider>
    </>
  );
};

export default HomePage;
