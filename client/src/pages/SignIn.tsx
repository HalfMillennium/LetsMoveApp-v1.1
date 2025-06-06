import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
          <ClerkSignIn 
            routing="path" 
            path="/sign-in" 
            redirectUrl="/profile"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}