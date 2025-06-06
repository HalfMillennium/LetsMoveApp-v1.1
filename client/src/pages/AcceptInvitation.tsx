
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { useSearchParty } from "../context/SearchPartyContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const AcceptInvitation = () => {
  const { token } = useParams();
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useUser();
  const { acceptInvitation, getInvitationDetails } = useSearchParty();
  const { toast } = useToast();
  
  const [invitationDetails, setInvitationDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitationDetails = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const details = await getInvitationDetails(token);
        setInvitationDetails(details);
      } catch (error) {
        setError("Invalid or expired invitation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [token, getInvitationDetails]);

  const handleAcceptInvitation = async () => {
    if (!token || !isSignedIn) return;

    try {
      setIsAccepting(true);
      await acceptInvitation(token);
      
      toast({
        title: "Success!",
        description: "You have successfully joined the search party.",
      });

      // Redirect to search parties page
      setLocation("/search-party");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitationDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              This invitation link is invalid or has expired.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-orange-400 hover:bg-orange-500 text-white"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Join Search Party</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-2">
              You've been invited to join:
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {invitationDetails.searchParty?.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Please sign in or create an account to accept this invitation.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/sign-in")}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setLocation("/sign-up")}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Search Party Invitation</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-2">
            You've been invited to join:
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {invitationDetails.searchParty?.name}
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Expires: {new Date(invitationDetails.invitation.expiresAt).toLocaleDateString()}
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Join this search party to collaborate on finding the perfect apartment together.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={handleAcceptInvitation}
              disabled={isAccepting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isAccepting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
            <Button 
              onClick={() => setLocation("/search-party")}
              variant="outline"
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
