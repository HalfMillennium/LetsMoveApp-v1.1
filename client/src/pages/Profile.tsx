import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParty } from "../context/SearchPartyContext";
import { 
  HousingPreferencesDialog, 
  NotificationPreferencesDialog, 
  ProfileEditDialog 
} from "../components/PreferenceDialogs";
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
  const { user: clerkUser, isLoaded } = useUser();

  // Fetch current user data from database
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users/me"],
    enabled: isLoaded && !!clerkUser,
  });

  // Show loading state while Clerk or user data is loading
  if (!isLoaded || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center w-full">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }
  // Early return if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center w-full">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
          <p className="text-gray-600 text-center">Unable to load user profile.</p>
        </div>
      </div>
    );
  }

  // Use data from database
  const apartmentPreferences = {
    minBedrooms: user.minBedrooms || 1,
    minBathrooms: user.minBathrooms || 1,
    maxPrice: user.maxPrice || 3000,
    petFriendly: user.petFriendly || false,
    parking: user.parking || false,
    furnished: user.furnished || false,
    laundry: user.laundry || false,
  };

  // Collections data (static for now)
  const collections = [
    {
      name: "Downtown Favorites",
      count: 12,
      icon: Building,
      color: "bg-blue-500",
    },
    { name: "Affordable 2BR", count: 8, icon: Home, color: "bg-green-500" },
    { name: "Luxury Options", count: 5, icon: Star, color: "bg-purple-500" },
    { name: "Near Office", count: 7, icon: Map, color: "bg-orange-500" },
  ];

  // Neighborhood preferences from database
  const neighborhoodPreferences = user.neighborhoodPreferences || [
    "Near Public Transit",
    "Walkable Area", 
    "Safe Neighborhood"
  ];

  const settingsOptions = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Email and push notifications",
      component: NotificationPreferencesDialog,
    },
    {
      icon: Settings,
      label: "General",
      description: "App preferences and settings",
      component: null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF5E6] w-full"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">
                Manage your account and preferences
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
              >
                Save Changes
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg">
              <div className="text-center">
                {/* Cover gradient */}
                <div className="h-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl mb-4 relative">
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={user?.imageUrl}
                          alt={user?.fullName || ""}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                          {user?.firstName?.charAt(0) ||
                            user?.emailAddresses[0]?.emailAddress?.charAt(0) ||
                            "U"}
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
                    {user?.fullName || clerkUser?.fullName || clerkUser?.firstName || "User"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {user?.email || clerkUser?.emailAddresses[0]?.emailAddress}
                  </p>
                  <div className="flex items-center justify-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {user?.location || "Not set"}
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
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-2">
                {settingsOptions.map((option, index) => {
                  const SettingComponent = option.component;
                  
                  if (SettingComponent) {
                    return (
                      <SettingComponent
                        key={index}
                        user={user || {}}
                        trigger={
                          <button className="w-full flex items-center justify-between py-3 rounded-xl hover:bg-white/50 transition-colors group">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                                <option.icon size={16} className="text-gray-600" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-medium text-gray-900">
                                  {option.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </button>
                        }
                      />
                    );
                  }
                  
                  return (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between py-3 rounded-xl hover:bg-white/50 transition-colors group"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                          <option.icon size={16} className="text-gray-600" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h3>
                <ProfileEditDialog
                  user={user}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 rounded-full"
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                  }
                />
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
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Housing Preferences
                </h3>
                <HousingPreferencesDialog
                  user={user}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 rounded-full"
                    >
                      <Settings size={14} />
                      Customize
                    </Button>
                  }
                />
              </div>

              <div className="space-y-6">
                {/* Quick Preferences */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">
                      {apartmentPreferences.minBedrooms}
                    </div>
                    <div className="text-xs text-gray-600">Min Bedrooms</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-center">
                    <Home className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">
                      {apartmentPreferences.minBathrooms}
                    </div>
                    <div className="text-xs text-gray-600">Min Bathrooms</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 text-center">
                    <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">
                      ${apartmentPreferences.maxPrice}
                    </div>
                    <div className="text-xs text-gray-600">Max Budget</div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <Heart className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">
                      {apartmentPreferences.petFriendly ? "Yes" : "No"}
                    </div>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary rounded-full"
                    >
                      <Plus size={14} />
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
                          onClick={() =>
                            handleRemoveNeighborhoodPreference(preference)
                          }
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
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  My Collections
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 rounded-full"
                >
                  <Plus size={14} />
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
                        <div
                          className={`w-10 h-10 ${collection.color} rounded-xl flex items-center justify-center mr-3`}
                        >
                          <collection.icon size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {collection.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {collection.count} listings
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Parties */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Search Parties
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 rounded-full"
                >
                  <Users size={14} />
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
                          <h4 className="font-medium text-gray-900">
                            {party.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Created{" "}
                            {new Date(party.createdAt).toLocaleDateString()}
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
