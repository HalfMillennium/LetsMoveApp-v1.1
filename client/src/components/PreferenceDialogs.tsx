import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Settings, 
  Home, 
  DollarSign, 
  Building, 
  Bell, 
  MapPin,
  Trash2,
  Plus
} from "lucide-react";

interface User {
  id: number;
  clerkId: string;
  email: string;
  fullName?: string;
  location?: string;
  bio?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  maxPrice?: number;
  petFriendly?: boolean;
  parking?: boolean;
  furnished?: boolean;
  laundry?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  searchAlerts?: boolean;
  neighborhoodPreferences?: string[];
}

interface HousingPreferencesDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export const HousingPreferencesDialog: React.FC<HousingPreferencesDialogProps> = ({
  user,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    minBedrooms: user.minBedrooms || 1,
    minBathrooms: user.minBathrooms || 1,
    maxPrice: user.maxPrice || 3000,
    petFriendly: user.petFriendly || false,
    parking: user.parking || false,
    furnished: user.furnished || false,
    laundry: user.laundry || false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await fetch("/api/users/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update preferences");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      toast({
        title: "Preferences Updated",
        description: "Your housing preferences have been saved.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Housing Preferences
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBedrooms" className="text-sm font-medium">
                Min Bedrooms
              </Label>
              <Input
                id="minBedrooms"
                type="number"
                min="0"
                max="10"
                value={preferences.minBedrooms}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    minBedrooms: parseInt(e.target.value) || 0,
                  })
                }
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minBathrooms" className="text-sm font-medium">
                Min Bathrooms
              </Label>
              <Input
                id="minBathrooms"
                type="number"
                min="0"
                max="10"
                value={preferences.minBathrooms}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    minBathrooms: parseInt(e.target.value) || 0,
                  })
                }
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-sm font-medium">
              Maximum Price ($)
            </Label>
            <Input
              id="maxPrice"
              type="number"
              min="0"
              step="100"
              value={preferences.maxPrice}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  maxPrice: parseInt(e.target.value) || 0,
                })
              }
              className="rounded-xl border-gray-200"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Amenities</Label>
            <div className="space-y-3">
              {[
                { key: "petFriendly", label: "Pet Friendly" },
                { key: "parking", label: "Parking Available" },
                { key: "furnished", label: "Furnished" },
                { key: "laundry", label: "Laundry Facilities" },
              ].map((amenity) => (
                <div key={amenity.key} className="flex items-center justify-between">
                  <Label htmlFor={amenity.key} className="text-sm">
                    {amenity.label}
                  </Label>
                  <Switch
                    id={amenity.key}
                    checked={preferences[amenity.key as keyof typeof preferences] as boolean}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        [amenity.key]: checked,
                      })
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-full border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updatePreferencesMutation.isPending}
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            {updatePreferencesMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface NotificationPreferencesDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export const NotificationPreferencesDialog: React.FC<NotificationPreferencesDialogProps> = ({
  user,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: user.emailNotifications ?? true,
    pushNotifications: user.pushNotifications ?? true,
    searchAlerts: user.searchAlerts ?? true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateNotificationsMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await fetch("/api/users/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update notifications");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateNotificationsMutation.mutate(notifications);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Notification Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {[
            {
              key: "emailNotifications",
              label: "Email Notifications",
              description: "Receive updates via email",
            },
            {
              key: "pushNotifications", 
              label: "Push Notifications",
              description: "Browser and mobile notifications",
            },
            {
              key: "searchAlerts",
              label: "Search Alerts",
              description: "New listings matching your criteria",
            },
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor={notification.key} className="text-sm font-medium">
                  {notification.label}
                </Label>
                <p className="text-xs text-gray-500">{notification.description}</p>
              </div>
              <Switch
                id={notification.key}
                checked={notifications[notification.key as keyof typeof notifications]}
                onCheckedChange={(checked) =>
                  setNotifications({
                    ...notifications,
                    [notification.key]: checked,
                  })
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-full border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateNotificationsMutation.isPending}
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            {updateNotificationsMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ProfileEditDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  user,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user.fullName || "",
    location: user.location || "",
    bio: user.bio || "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await fetch("/api/users/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(profile);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="rounded-xl border-gray-200"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              className="rounded-xl border-gray-200"
              placeholder="City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              About Your Housing Needs
            </Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              className="min-h-24 rounded-xl border-gray-200"
              placeholder="Tell us about your ideal living situation..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-full border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};