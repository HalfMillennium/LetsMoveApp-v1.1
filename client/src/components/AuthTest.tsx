import { useAuth } from '../context/AuthContext';

export default function AuthTest() {
  try {
    const { isSignedIn, user } = useAuth();
    return (
      <div className="p-4 bg-white text-black">
        <h3>Auth Test</h3>
        <p>Signed in: {isSignedIn ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.email : 'None'}</p>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800">
        <h3>Auth Error</h3>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}