import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USER } from "../lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Archive, Eye, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(DEFAULT_USER);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.fullName?.split(" ")[0] || "",
    lastName: user.fullName?.split(" ")[1] || "",
    email: user.email || "",
    username: user.username || "",
    country: "United States",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Update user (in a real app, would send to server)
    setUser((prev) => ({
      ...prev,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      username: formData.username,
    }));

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  // Mock data for profile stats
  const profileStats = {
    firstSeen: "1 Mar, 2025",
    firstPurchase: "4 Mar, 2025",
    revenue: "$118.00",
    mrr: "$0.00",
  };

  return (
    <div className="py-8 flex flex-1 justify-center">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Banner Image + Close Button */}
        <div className="relative h-32 bg-gradient-to-r from-purple-300 to-yellow-200">
          <button className="absolute top-4 right-4 text-gray-700 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="px-8 pb-8">
          {/* Profile Image + Action Buttons */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white rounded-full">
                <AvatarImage 
                  src={user.profileImage} 
                  alt={user.fullName}
                  className="object-cover" 
                />
                <AvatarFallback>
                  {user.fullName?.charAt(0) || user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Archive size={16} />
                <span>Archive</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye size={16} />
                <span>View orders</span>
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-gray-600">{user.email}</p>
            
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Subscribed
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-8 border-b border-t py-4">
            <div>
              <p className="text-sm text-gray-500">First seen</p>
              <p className="font-medium">{profileStats.firstSeen}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">First purchase</p>
              <p className="font-medium">{profileStats.firstPurchase}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="font-medium">{profileStats.revenue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">MRR</p>
              <p className="font-medium">{profileStats.mrr}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="w-full"
                />
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="w-full"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                </div>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full"
                />
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <div className="mr-1 bg-blue-100 text-blue-800 p-1 rounded-full">
                  <Check size={12} />
                </div>
                <span>VERIFIED 2 JAN, 2025</span>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <Select defaultValue={formData.country}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">
                    <div className="flex items-center">
                      <span className="mr-2">🇺🇸</span>
                      United States
                    </div>
                  </SelectItem>
                  <SelectItem value="Canada">
                    <div className="flex items-center">
                      <span className="mr-2">🇨🇦</span>
                      Canada
                    </div>
                  </SelectItem>
                  <SelectItem value="United Kingdom">
                    <div className="flex items-center">
                      <span className="mr-2">🇬🇧</span>
                      United Kingdom
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  untitledui.com/
                </span>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="flex-grow rounded-none rounded-r-md"
                />
                <div className="ml-2 p-2 bg-blue-100 text-blue-800 rounded-full">
                  <Check size={16} />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
