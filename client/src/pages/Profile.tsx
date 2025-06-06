import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParty } from "../context/SearchPartyContext";
import {
  MapPin,
  User,
  Edit,
  X,
  Plus,
  Heart,
  Building,
  Home,
  DollarSign,
  Map,
  Settings,
  Star,
  Calendar,
  Users,
  ChevronRight,
  Bell,
  Shield,
  CreditCard,
  Camera,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { toast } = useToast();
  const { searchParties } = useSearchParty();
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    mobileNumber: user?.phoneNumbers[0]?.phoneNumber || "",
    location: "New York, NY",
    bio: "Looking for a 2-bedroom apartment in downtown with access to public transportation. I work as a software engineer and need a home office.",
  });

  // Housing preferences
  const [apartmentPreferences, setApartmentPreferences] = useState({
    minBedrooms: 2,
    minBathrooms: 1,
    maxPrice: 3000,
    petFriendly: true,
    parking: true,
    furnished: false,
    laundry: true,
  });

  // Collections data
  const [collections, setCollections] = useState([
    { name: "Downtown Favorites", count: 12, icon: Building, color: "bg-blue-500" },
    { name: "Affordable 2BR", count: 8, icon: Home, color: "bg-green-500" },
    { name: "Luxury Options", count: 5, icon: Star, color: "bg-purple-500" },
    { name: "Near Office", count: 7, icon: Map, color: "bg-orange-500" },
  ]);

  // Neighborhood preferences
  const [neighborhoodPreferences, setNeighborhoodPreferences] = useState([
    "Near Public Transit",
    "Walkable Area", 
    "Grocery Stores",
    "Parks Nearby",
    "Coffee Shops",
    "Safe Neighborhood",
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Note: Clerk user data updates should be handled through Clerk's API
    // For now, we'll just show a success message for local form data
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleRemoveNeighborhoodPreference = (preference: string) => {
    setNeighborhoodPreferences(
      neighborhoodPreferences.filter((item) => item !== preference),
    );
  };

  const settingsOptions = [
    { icon: Bell, label: "Notifications", description: "Email and push notifications" },
    { icon: Shield, label: "Privacy", description: "Control your data and visibility" },
    { icon: CreditCard, label: "Billing", description: "Manage payment methods" },
    { icon: Settings, label: "General", description: "App preferences and settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            <Button 
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="text-center">
                {/* Cover gradient */}
                <div className="h-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl mb-4 relative">
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                          {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <Camera size={14} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user?.fullName || user?.firstName || "User"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">{user?.emailAddresses[0]?.emailAddress}</p>
                  <div className="flex items-center justify-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {formData.location}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-gray-900">24</div>
                    <div className="text-xs text-gray-500">Saved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">8</div>
                    <div className="text-xs text-gray-500">Viewed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">3</div>
                    <div className="text-xs text-gray-500">Parties</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-2">
                {settingsOptions.map((option, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                        <option.icon size={16} className="text-gray-600" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="bg-white/60 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/60 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className="bg-white/60 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-white/60 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Housing Preferences */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Housing Preferences</h3>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <Settings size={14} className="mr-2" />
                  Customize
                </Button>
              </div>

              <div className="space-y-6">
                {/* Quick Preferences */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{apartmentPreferences.minBedrooms}</div>
                    <div className="text-xs text-gray-600">Min Bedrooms</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-center">
                    <Home className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{apartmentPreferences.minBathrooms}</div>
                    <div className="text-xs text-gray-600">Min Bathrooms</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 text-center">
                    <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">${apartmentPreferences.maxPrice}</div>
                    <div className="text-xs text-gray-600">Max Budget</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <Heart className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{apartmentPreferences.petFriendly ? 'Yes' : 'No'}</div>
                    <div className="text-xs text-gray-600">Pet Friendly</div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Your Housing Needs
                  </label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="min-h-24 bg-white/60 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
                    placeholder="Tell us about your ideal living situation..."
                  />
                </div>

                {/* Neighborhood Preferences */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Neighborhood Preferences
                    </label>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Plus size={14} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {neighborhoodPreferences.map((preference, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-white/60 text-gray-700 border border-gray-200 hover:bg-white/80 px-3 py-1"
                      >
                        {preference}
                        <button
                          onClick={() => handleRemoveNeighborhoodPreference(preference)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Collections */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">My Collections</h3>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <Plus size={14} className="mr-2" />
                  New Collection
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map((collection, index) => (
                  <div
                    key={index}
                    className="bg-white/60 rounded-2xl p-4 border border-gray-100 hover:bg-white/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${collection.color} rounded-xl flex items-center justify-center mr-3`}>
                          <collection.icon size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{collection.name}</h4>
                          <p className="text-sm text-gray-500">{collection.count} listings</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Parties */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Search Parties</h3>
                <Button variant="outline" size="sm" className="border-gray-200">
                  <Users size={14} className="mr-2" />
                  Create Party
                </Button>
              </div>

              <div className="space-y-4">
                {searchParties.map((party) => (
                  <div
                    key={party.id}
                    className="bg-white/60 rounded-2xl p-4 border border-gray-100 hover:bg-white/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                          <Users size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{party.name}</h4>
                          <p className="text-sm text-gray-500">
                            Created {new Date(party.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;