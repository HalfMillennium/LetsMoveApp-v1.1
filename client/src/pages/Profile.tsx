import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USER } from "../lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ExternalLink,
  Sun,
  MessageSquare,
  Bell,
  User,
  Edit,
  X,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(DEFAULT_USER);
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    mobileNumber: "+966 5502938123",
    role: "Senior Product designer",
    bio: "Hey, I'm a product designer specialized in user interface designs (Web & Mobile) with 10 years of experience. Last year I have been ranked as a top-rated designer on Upwork working for over +3,750 hours with high clients satisfaction, on-time delivery and top quality output.",
  });

  // Industry/Interests tags
  const [interests, setInterests] = useState([
    "UI Design",
    "Framer",
    "Startups",
    "UX",
    "Crypto",
    "Mobile Apps",
    "Webflow",
  ]);

  // Social media accounts
  const [socialAccounts, setSocialAccounts] = useState([
    { icon: "twitter", url: "https://twitter.com/ShaltOni" },
    { icon: "instagram", url: "https://instagram.com/shaltoni" },
    { icon: "linkedin", url: "https://www.linkedin.com/in/aymanshaltoni/" },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser((prev) => ({
      ...prev,
      fullName: formData.fullName,
      email: formData.email,
    }));

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((item) => item !== interest));
  };

  return (
    <div className="py-8 bg-[#FFF9F2] flex flex-1">
      <div className="container mx-auto px-4">
        {/* Header with Title and Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#1A4A4A]">Your Profile</h2>
            <p className="text-[#1A4A4A]/70 mt-2">
              View and edit your profile information
            </p>
          </div>
        </div>

        {/* Two-column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Personal Information */}
          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <div className="flex flex-col items-center relative mb-4">
                <div className="w-full bg-gradient-to-r from-purple-300/80 via-teal-300/80 to-orange-300/80 h-24 rounded-md"></div>
                <div className="relative -mt-12">
                  <Avatar className="w-24 h-24 border-4 border-white rounded-full bg-white overflow-hidden">
                    <AvatarImage
                      src={user.profileImage}
                      alt={user.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.fullName?.charAt(0) || user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-white/90 p-1 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
                    <Edit size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="font-medium text-[#1A4A4A]">Your Photo</h3>
                <p className="text-sm text-gray-600">
                  This will be displayed on your profile
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-sm bg-white/50 border-white/50"
                >
                  Upload New
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#E9927E] hover:bg-[#E9927E]/90"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                Personal information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-500" />
                    </div>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile number
                  </label>
                  <div className="flex">
                    <Button
                      variant="outline"
                      className="rounded-r-none border-r-0 w-20 bg-white/70 border-white/40"
                    >
                      +966
                    </Button>
                    <Input
                      name="mobileNumber"
                      value="5502938123"
                      onChange={handleInputChange}
                      className="rounded-l-none w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bio, Interests, Social */}
          <div className="space-y-6">
            {/* Bio Section */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">Bio</h2>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="min-h-32 resize-none w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                placeholder="Write a short bio about yourself..."
              />
            </div>

            {/* Industry/Interests Section */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                Industry/Interests
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 px-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-[#1A4A4A]"
                  >
                    {interest}
                    <button onClick={() => handleRemoveInterest(interest)}>
                      <X size={14} className="ml-1" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center bg-white/50 border-white/40 hover:bg-white/80"
              >
                <Plus size={16} className="mr-2" />
                Add more
              </Button>
            </div>

            {/* Social Media Accounts */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                Social Media accounts
              </h2>
              <div className="space-y-3">
                {socialAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border border-white/40 rounded-lg p-2 bg-white/40 backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center w-8 h-8 bg-white/60 rounded-full">
                      {account.icon === "twitter" && <span>🐦</span>}
                      {account.icon === "instagram" && <span>📸</span>}
                      {account.icon === "linkedin" && <span>🔗</span>}
                    </span>
                    <Input
                      value={account.url}
                      readOnly
                      className="flex-1 bg-transparent border-none focus:ring-0"
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center mt-4 bg-white/50 border-white/40 hover:bg-white/80"
              >
                <Plus size={16} className="mr-2" />
                Add more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
