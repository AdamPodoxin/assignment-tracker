import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

const HomePage = () => {
  return (
    <>
      <h1 className="text-2xl">Assignment Tracker</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </>
  );
};

export default HomePage;
