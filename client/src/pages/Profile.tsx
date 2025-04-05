import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USER } from "../lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(DEFAULT_USER);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Update user (in a real app, would send to server)
    setUser((prev) => ({
      ...prev,
      fullName: formData.fullName,
      email: formData.email,
    }));

    setEditing(false);

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="py-8 bg-[#FFF9F2] flex flex-1">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#1A4A4A] mb-6">Your Profile</h2>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.profileImage} alt={user.fullName} />
                  <AvatarFallback>
                    {user.fullName?.charAt(0) || user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1A4A4A]">
                    {user.fullName || user.username}
                  </h3>
                  <p className="text-[#1A4A4A]/70">{user.email}</p>

                  {!editing ? (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <form onSubmit={handleSave} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Full Name
                        </label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Email
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          New Password
                        </label>
                        <Input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Confirm Password
                        </label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          className="bg-[#E9927E] hover:bg-[#E9927E]/90"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="preferences" className="px-6 pb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Preferences</CardTitle>
                    <CardDescription>
                      Set your default search preferences for apartment
                      listings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Min Price
                        </label>
                        <Input
                          type="number"
                          placeholder="$0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Max Price
                        </label>
                        <Input
                          type="number"
                          placeholder="$3000"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A4A4A]">
                        Preferred Neighborhoods
                      </label>
                      <Input
                        placeholder="E.g., Chelsea, West Village"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Bedrooms
                        </label>
                        <Input type="number" placeholder="1" className="mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A4A4A]">
                          Bathrooms
                        </label>
                        <Input type="number" placeholder="1" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-[#1A4A4A] hover:bg-[#1A4A4A]/90">
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1A4A4A]">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-[#1A4A4A]/70">
                          Receive email updates about new listings
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#E9927E] focus:ring-[#E9927E]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#1A4A4A]">
                          SMS Notifications
                        </h4>
                        <p className="text-sm text-[#1A4A4A]/70">
                          Receive text messages about search party updates
                        </p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          id="sms-notifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#E9927E] focus:ring-[#E9927E]"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="font-medium text-[#1A4A4A] mb-2">
                        Delete Account
                      </h4>
                      <p className="text-sm text-[#1A4A4A]/70 mb-4">
                        Permanently delete your account and all associated data.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          toast({
                            title: "Are you sure?",
                            description: "This action cannot be undone.",
                            variant: "destructive",
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
