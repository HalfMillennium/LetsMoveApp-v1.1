import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join letsmove</h1>
          <p className="text-gray-600">Create your account to start finding your perfect home</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            redirectUrl="/profile"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}