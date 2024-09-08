import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { Button } from "~/components/ui/button";
import NewSemesterDialog from "~/components/NewSemesterDialog";

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
        <Button>
          <SignInButton />
        </Button>
      </SignedOut>

      <SignedIn>
        <Button>
          <SignOutButton />
        </Button>

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
      </SignedIn>
    </>
  );
};

export default HomePage;
