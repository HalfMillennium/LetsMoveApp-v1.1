import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USER } from "../lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParty } from "../context/SearchPartyContext";
import {
  ExternalLink,
  Home,
  Building,
  MapPin,
  DollarSign,
  Users,
  User,
  UserCircle,
  Edit,
  X,
  Plus,
  Heart,
  Bookmark,
  Bed,
  Bath,
  Ruler,
  GripHorizontal,
  Check,
  ParkingSquare,
  Wifi,
  DoorOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Profile = () => {
  const { toast } = useToast();
  const { searchParties } = useSearchParty();
  const [user, setUser] = useState(DEFAULT_USER);
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    mobileNumber: "+1 555-123-4567",
    location: "New York, NY",
    bio: "Looking for a 2-bedroom apartment in downtown with access to public transportation. I work as a software engineer and need a home office. I enjoy properties with natural light and outdoor space."
  });

  // Housing preferences
  const [apartmentPreferences, setApartmentPreferences] = useState({
    minBedrooms: 2,
    minBathrooms: 1,
    minSquareFeet: 800,
    maxPrice: 3000,
    petFriendly: true,
    parking: true,
    furnished: false,
    laundry: true,
    airConditioning: true,
    dishwasher: true
  });

  // Neighborhood preferences tags
  const [neighborhoodPreferences, setNeighborhoodPreferences] = useState([
    "Near Public Transit",
    "Walkable Area",
    "Grocery Stores",
    "Parks Nearby",
    "Coffee Shops",
    "Quiet Street",
    "Safe Neighborhood"
  ]);

  // User collections
  const [collections, setCollections] = useState([
    { name: "Downtown Favorites", count: 12, icon: "building" },
    { name: "Affordable 2BR", count: 8, icon: "home" },
    { name: "Luxury Options", count: 5, icon: "dollar" },
    { name: "Near Office", count: 7, icon: "map" }
  ]);

  // Friends/Roommates
  const [friends, setFriends] = useState([
    { id: 1, name: "Alex Johnson", profileImage: "https://i.pravatar.cc/150?img=1", status: "active" },
    { id: 2, name: "Jamie Smith", profileImage: "https://i.pravatar.cc/150?img=2", status: "active" },
    { id: 3, name: "Taylor Wilson", profileImage: "https://i.pravatar.cc/150?img=3", status: "active" },
    { id: 4, name: "Jordan Lee", profileImage: "https://i.pravatar.cc/150?img=4", status: "pending" }
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

  // Function to handle removing a neighborhood preference
  const handleRemoveNeighborhoodPreference = (preference: string) => {
    setNeighborhoodPreferences(neighborhoodPreferences.filter(item => item !== preference));
  };
  
  // Function to toggle a housing preference
  const handleToggleHousingPreference = (preference: keyof typeof apartmentPreferences) => {
    setApartmentPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  return (
    <div className="py-8 bg-[#FFF9F2] flex flex-1">
      <div className="container mx-auto px-4">
        {/* Header with Title and Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#1A4A4A]">Your Profile</h2>
            <p className="text-[#1A4A4A]/70 mt-2">
              Manage your account and housing preferences
            </p>
          </div>
          <div>
            <Button
              variant="default"
              size="sm"
              className="bg-[#E9927E] hover:bg-[#E9927E]/90"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="profile" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-6 bg-white/50 backdrop-blur-sm border border-white/40">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#E9927E] data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-[#E9927E] data-[state=active]:text-white">
              Housing Preferences
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-[#E9927E] data-[state=active]:text-white">
              Collections
            </TabsTrigger>
            <TabsTrigger value="search-parties" className="data-[state=active]:bg-[#E9927E] data-[state=active]:text-white">
              Search Parties
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab Content */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Personal Information */}
              <div className="space-y-6">
                {/* Photo Upload Section */}
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <div className="flex flex-col items-center relative mb-4">
                    <div className="w-full bg-gradient-to-r from-[#E9927E]/60 via-[#E9927E]/40 to-[#E9927E]/20 h-24 rounded-md"></div>
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
                    <h3 className="font-medium text-[#1A4A4A]">
                      {user.fullName || user.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Member since {new Date().getFullYear()}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="backdrop-blur-sm bg-white/50 border-white/40"
                    >
                      Upload New Photo
                    </Button>
                  </div>
                </div>

                {/* Personal Information Form */}
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                    Personal Information
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
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCircle size={16} className="text-gray-500" />
                        </div>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <Input
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-gray-500" />
                        </div>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="pl-10 w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Bio and Friends */}
              <div className="space-y-6">
                {/* Bio Section */}
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">Housing Preferences Bio</h2>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="min-h-32 resize-none w-full bg-white/50 border-white/40 focus:border-[#E9927E]/70 focus:ring-[#E9927E]/30"
                    placeholder="Describe what you're looking for in your next home..."
                  />
                </div>

                {/* Friends/Roommates Section */}
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#1A4A4A]">
                      Friends & Roommates
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/50 border-white/40"
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={friend.profileImage} alt={friend.name} />
                          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{friend.name}</p>
                          <p className="text-xs text-gray-500">
                            {friend.status === 'active' ? 'Active Member' : 'Invite Pending'}
                          </p>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`${friend.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} border-0`}
                        >
                          {friend.status === 'active' ? 'Active' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Housing Preferences Tab Content */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Apartment Preferences */}
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                    Apartment Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Bedrooms */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Minimum Bedrooms
                        </label>
                        <span className="font-medium text-[#E9927E]">
                          {apartmentPreferences.minBedrooms}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <Slider
                          value={[apartmentPreferences.minBedrooms]}
                          min={0}
                          max={5}
                          step={1}
                          onValueChange={(value) => setApartmentPreferences({...apartmentPreferences, minBedrooms: value[0]})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Bathrooms */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Minimum Bathrooms
                        </label>
                        <span className="font-medium text-[#E9927E]">
                          {apartmentPreferences.minBathrooms}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <Slider
                          value={[apartmentPreferences.minBathrooms]}
                          min={1}
                          max={4}
                          step={0.5}
                          onValueChange={(value) => setApartmentPreferences({...apartmentPreferences, minBathrooms: value[0]})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Size */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Minimum Square Feet
                        </label>
                        <span className="font-medium text-[#E9927E]">
                          {apartmentPreferences.minSquareFeet} sq ft
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <Slider
                          value={[apartmentPreferences.minSquareFeet]}
                          min={400}
                          max={2000}
                          step={50}
                          onValueChange={(value) => setApartmentPreferences({...apartmentPreferences, minSquareFeet: value[0]})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    {/* Budget */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Maximum Monthly Rent
                        </label>
                        <span className="font-medium text-[#E9927E]">
                          ${apartmentPreferences.maxPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <Slider
                          value={[apartmentPreferences.maxPrice]}
                          min={500}
                          max={5000}
                          step={100}
                          onValueChange={(value) => setApartmentPreferences({...apartmentPreferences, maxPrice: value[0]})}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                    Must-Have Amenities
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${apartmentPreferences.petFriendly ? 'bg-[#E9927E]/10 border-[#E9927E]/30' : 'bg-white/40 border-white/40'}`}
                      onClick={() => handleToggleHousingPreference('petFriendly')}
                    >
                      <div className={`h-5 w-5 rounded flex items-center justify-center ${apartmentPreferences.petFriendly ? 'bg-[#E9927E] text-white' : 'bg-white border border-gray-300'}`}>
                        {apartmentPreferences.petFriendly && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Pet Friendly</span>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${apartmentPreferences.parking ? 'bg-[#E9927E]/10 border-[#E9927E]/30' : 'bg-white/40 border-white/40'}`}
                      onClick={() => handleToggleHousingPreference('parking')}
                    >
                      <div className={`h-5 w-5 rounded flex items-center justify-center ${apartmentPreferences.parking ? 'bg-[#E9927E] text-white' : 'bg-white border border-gray-300'}`}>
                        {apartmentPreferences.parking && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Parking</span>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${apartmentPreferences.laundry ? 'bg-[#E9927E]/10 border-[#E9927E]/30' : 'bg-white/40 border-white/40'}`}
                      onClick={() => handleToggleHousingPreference('laundry')}
                    >
                      <div className={`h-5 w-5 rounded flex items-center justify-center ${apartmentPreferences.laundry ? 'bg-[#E9927E] text-white' : 'bg-white border border-gray-300'}`}>
                        {apartmentPreferences.laundry && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">In-unit Laundry</span>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${apartmentPreferences.airConditioning ? 'bg-[#E9927E]/10 border-[#E9927E]/30' : 'bg-white/40 border-white/40'}`}
                      onClick={() => handleToggleHousingPreference('airConditioning')}
                    >
                      <div className={`h-5 w-5 rounded flex items-center justify-center ${apartmentPreferences.airConditioning ? 'bg-[#E9927E] text-white' : 'bg-white border border-gray-300'}`}>
                        {apartmentPreferences.airConditioning && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">A/C</span>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${apartmentPreferences.dishwasher ? 'bg-[#E9927E]/10 border-[#E9927E]/30' : 'bg-white/40 border-white/40'}`}
                      onClick={() => handleToggleHousingPreference('dishwasher')}
                    >
                      <div className={`h-5 w-5 rounded flex items-center justify-center ${apartmentPreferences.dishwasher ? 'bg-[#E9927E] text-white' : 'bg-white border border-gray-300'}`}>
                        {apartmentPreferences.dishwasher && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Dishwasher</span>
                    </div>
                    
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${apartmentPreferences.furnished ? 'bg-[#E9927E]/10 border-[#E9927E]/30' : 'bg-white/40 border-white/40'}`}
                      onClick={() => handleToggleHousingPreference('furnished')}
                    >
                      <div className={`h-5 w-5 rounded flex items-center justify-center ${apartmentPreferences.furnished ? 'bg-[#E9927E] text-white' : 'bg-white border border-gray-300'}`}>
                        {apartmentPreferences.furnished && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Furnished</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Neighborhood Preferences */}
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-6 border border-white/40">
                  <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                    Neighborhood Preferences
                  </h2>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {neighborhoodPreferences.map((preference, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-[#1A4A4A]"
                      >
                        {preference}
                        <button onClick={() => handleRemoveNeighborhoodPreference(preference)}>
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
                    Add More Preferences
                  </Button>
                </div>
                
                {/* Map View Placeholder */}
                <div className="glass-card rounded-xl p-6 border border-white/40 h-80 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <MapPin className="h-10 w-10 text-[#E9927E] mx-auto mb-2" />
                      <h3 className="font-medium text-[#1A4A4A] mb-1">Preferred Neighborhoods</h3>
                      <p className="text-sm text-gray-500 mb-4">Select your preferred areas on the map</p>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-[#E9927E] hover:bg-[#E9927E]/90"
                      >
                        Open Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Collections Tab Content */}
          <TabsContent value="collections" className="space-y-6">
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#1A4A4A]">
                  Your Collections
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/50 border-white/40"
                >
                  <Plus size={16} className="mr-1" />
                  New Collection
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40 hover:bg-white/60 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#E9927E]/20 flex items-center justify-center text-[#E9927E] mr-2">
                          {collection.icon === "building" && <Building className="h-4 w-4" />}
                          {collection.icon === "home" && <Home className="h-4 w-4" />}
                          {collection.icon === "dollar" && <DollarSign className="h-4 w-4" />}
                          {collection.icon === "map" && <MapPin className="h-4 w-4" />}
                        </div>
                        <h3 className="font-medium text-[#1A4A4A]">{collection.name}</h3>
                      </div>
                      <Badge variant="secondary" className="bg-white/80">
                        {collection.count}
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/40 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Last updated: 2 days ago</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <GripHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Saved Apartments */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                Recently Saved
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="rounded-lg overflow-hidden bg-white/30 border border-white/30">
                    <div className="h-36 overflow-hidden relative">
                      <img 
                        src={`https://picsum.photos/seed/${item}/300/200`} 
                        alt="Apartment" 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/70 p-0 hover:bg-white"
                      >
                        <Heart className="h-4 w-4 text-[#E9927E]" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm text-[#1A4A4A] mb-1 truncate">
                        Modern {item+1}-Bedroom Apartment
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2 justify-between">
                        <div className="flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          <span>{item+1}</span>
                          <span className="mx-1">•</span>
                          <Bath className="h-3 w-3 mr-1" />
                          <span>{item}</span>
                        </div>
                        <span className="font-medium text-[#1A4A4A]">${1000 + (item * 500)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Search Parties Tab Content */}
          <TabsContent value="search-parties" className="space-y-6">
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#1A4A4A]">
                  Your Search Parties
                </h2>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#E9927E] hover:bg-[#E9927E]/90"
                >
                  <Plus size={16} className="mr-1" />
                  New Search Party
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {searchParties && searchParties.length > 0 ? (
                  searchParties.map((party) => (
                    <div
                      key={party.id}
                      className="p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/40"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-[#1A4A4A]">{party.name}</h3>
                        <span className="text-xs text-gray-500">
                          Created {new Date(party.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex mt-3 justify-between">
                        <div className="flex -space-x-2">
                          {party.members && party.members.slice(0, 3).map((member, idx) => (
                            <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                              {member.user?.profileImage ? (
                                <AvatarImage src={member.user.profileImage} />
                              ) : (
                                <AvatarFallback>
                                  {member.user?.username?.charAt(0) || 'U'}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          ))}
                          {(!party.members || party.members.length === 0) && (
                            <Avatar className="h-8 w-8 border-2 border-white">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="h-8 w-8 rounded-full bg-[#E9927E]/10 border-2 border-white flex items-center justify-center">
                            <Plus className="h-4 w-4 text-[#E9927E]" />
                          </div>
                        </div>
                        
                        <div className="space-x-1">
                          <Badge variant="outline" className="bg-white/60">
                            {party.listings?.length || 0} Listings
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 p-0 w-8">
                            <GripHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Progress bar showing apartment matching rate */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Matching preferences</span>
                          <span className="text-[#E9927E] font-medium">
                            {Math.floor(Math.random() * 50) + 50}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#E9927E]" 
                            style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Search Parties Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first search party to collaborate with friends</p>
                    <Button
                      variant="default"
                      className="bg-[#E9927E] hover:bg-[#E9927E]/90"
                    >
                      <Plus size={16} className="mr-1" />
                      Create Search Party
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Invitations */}
            <div className="glass-card rounded-xl p-6 border border-white/40">
              <h2 className="text-xl font-semibold mb-4 text-[#1A4A4A]">
                Pending Invitations
              </h2>
              
              <div className="space-y-3">
                <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#1A4A4A]">Jordan Davis</p>
                        <p className="text-xs text-gray-500">Invited you to "NYC Apartment Hunt"</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 bg-white/70 border-white/40"
                      >
                        Decline
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-8 bg-[#E9927E] hover:bg-[#E9927E]/90"
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
