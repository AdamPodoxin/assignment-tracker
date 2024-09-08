import { type ReactNode } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import NewSemesterDialog from "~/components/NewSemesterDialog";

const AuthButton = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      {children}
    </div>
  );
};

const HomePage = async () => {
  const authObject = auth();
  const userId = authObject.userId ?? "";

  const semesters = await db.semester.findMany({
    where: {
      userId,
    },
  });

  return (
    <>
      <h1 className="text-2xl">Assignment Tracker</h1>

      <SignedOut>
        <AuthButton>
          <SignInButton />
        </AuthButton>
      </SignedOut>

      <SignedIn>
        <AuthButton>
          <SignOutButton />
        </AuthButton>

        <div>
          <h1 className="my-4 text-xl">Semesters:</h1>
          <div className="flex items-center justify-center gap-8">
            {semesters.map((semester) => (
              <a
                href={`/semester/${semester.id}`}
                key={semester.id}
                className="flex h-[150px] w-[150px] items-center justify-center rounded-xl border-[1px] border-white text-lg"
              >
                {semester.name}
              </a>
            ))}

            <NewSemesterDialog />
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default HomePage;
