import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

const HomePage = () => {
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
      </SignedIn>
    </>
  );
};

export default HomePage;
