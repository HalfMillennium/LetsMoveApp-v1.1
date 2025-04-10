import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USER } from "../lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Archive, CheckCircle, Mail, ChevronDown } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState({
    ...DEFAULT_USER,
    firstName: "Demo",
    lastName: "User",
    country: "United States",
    username: "demouser",
    firstSeen: "1 Apr, 2025",
    firstPurchase: "4 Apr, 2025",
    revenue: "$118.00",
    mrr: "$0.00",
    verifiedDate: "2 Jan, 2025"
  });
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    country: user.country,
    username: user.username
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser((prev) => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: formData.country,
      username: formData.username,
      fullName: `${formData.firstName} ${formData.lastName}`
    }));

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-purple-300 to-amber-200">
          <button className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-sm rounded-full">
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        {/* Profile Header Section */}
        <div className="pt-4 px-8 flex justify-between items-start">
          {/* Profile Image */}
          <div className="relative -mt-16">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={user.profileImage} alt={user.fullName} />
              <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              View orders
            </Button>
          </div>
        </div>
        
        {/* User Name & Email */}
        <div className="px-8 mt-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
              Subscribed
            </span>
          </div>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
        
        {/* User Stats */}
        <div className="grid grid-cols-4 gap-8 px-8 mt-6 py-4 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">First seen</p>
            <p className="font-medium">{user.firstSeen}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">First purchase</p>
            <p className="font-medium">{user.firstPurchase}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="font-medium">{user.revenue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">MRR</p>
            <p className="font-medium">{user.mrr}</p>
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="px-8 py-4 space-y-6">
          {/* Name Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
              />
            </div>
          </div>
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Email address"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-500">VERIFIED {user.verifiedDate}</span>
            </div>
          </div>
          
          {/* Country Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <Select defaultValue={formData.country}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex">
              <div className="bg-gray-100 text-gray-500 py-2 px-3 border border-r-0 border-gray-300 rounded-l-md">
                untitledui.com/
              </div>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="px-8 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            country: user.country,
            username: user.username
          })}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
