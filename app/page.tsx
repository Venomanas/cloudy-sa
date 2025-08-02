import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Your App</h1>

        <SignedOut>
          <div className="space-y-4">
            <p>Please sign in to continue</p>
            <SignInButton mode="modal">
              <button className="bg-blue-500 text-white px-6 py-2 rounded">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="space-y-4">
            <p>You are signed in!</p>
            <UserButton  />
            <div>
              <a
                href="/social-share"
                className="bg-green-500 text-white px-6 py-2 rounded"
              >
                Go to Social Share
              </a>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
