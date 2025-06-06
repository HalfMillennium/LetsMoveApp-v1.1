import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-16 w-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join LetsMove
          </h1>
          <p className="text-gray-600">
            Create your account and start finding your perfect home
          </p>
        </div>
        <div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-white/60 border-gray-200 hover:bg-white/80",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/80",
              },
            }}
            redirectUrl="/listings"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
