import { useState, useEffect } from "react";
import { AdminSettings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Trash2, Settings, Save, Key, UserPlus, Edit, Users, Shield, ToggleLeft } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface Moderator {
  id: string;
  name: string;
  userId: string;
  password: string;
  createdAt: string;
}

export default function Admin() {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [, navigate] = useLocation();
  
  const [settings, setSettings] = useState<AdminSettings>({
    currentMonth: new Date().toISOString().slice(0, 7),
    employeeOfMonthMessage: "Congratulations to our top performers this month!",
  });

  // Admin credentials change
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [currentAdminPassword, setCurrentAdminPassword] = useState("");
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Moderator management
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [newModName, setNewModName] = useState("");
  const [newModUserId, setNewModUserId] = useState("");
  const [newModPassword, setNewModPassword] = useState("");
  const [editingMod, setEditingMod] = useState<string | null>(null);
  const [editModName, setEditModName] = useState("");
  const [editModUserId, setEditModUserId] = useState("");
  const [editModPassword, setEditModPassword] = useState("");

  // Feature toggles
  const [voiceArtistEnabled, setVoiceArtistEnabled] = useState(true);
  const [attendanceEnabled, setAttendanceEnabled] = useState(true);
  const [workFlowEnabled, setWorkFlowEnabled] = useState(true);
  const [videoUploadTimeEnabled, setVideoUploadTimeEnabled] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (userRole !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only administrators can access this page",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [userRole, navigate, toast]);

  useEffect(() => {
    const stored = localStorage.getItem("dob_settings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }

    const storedMods = localStorage.getItem("dob_moderators");
    if (storedMods) {
      setModerators(JSON.parse(storedMods));
    }

    const storedFeatures = localStorage.getItem("dob_feature_toggles");
    if (storedFeatures) {
      const features = JSON.parse(storedFeatures);
      setVoiceArtistEnabled(features.voiceArtistEnabled ?? true);
      setAttendanceEnabled(features.attendanceEnabled ?? true);
      setWorkFlowEnabled(features.workFlowEnabled ?? true);
      setVideoUploadTimeEnabled(features.videoUploadTimeEnabled ?? true);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("dob_settings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Admin settings have been updated successfully",
    });
  };

  const handleChangeAdminCredentials = () => {
    // Get current admin credentials from localStorage
    const storedAdmin = localStorage.getItem("dob_admin_credentials");
    const adminCreds = storedAdmin 
      ? JSON.parse(storedAdmin) 
      : { userId: "MDBD51724", password: "shuvo@282##" };

    // Verify current credentials
    if (currentAdminId !== adminCreds.userId || currentAdminPassword !== adminCreds.password) {
      toast({
        title: "Verification Failed",
        description: "Current credentials are incorrect",
        variant: "destructive",
      });
      return;
    }

    // Validate new credentials
    if (!newAdminId || !newAdminPassword) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newAdminPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match",
        variant: "destructive",
      });
      return;
    }

    if (newAdminPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    // Save new credentials
    const newCreds = { userId: newAdminId, password: newAdminPassword };
    localStorage.setItem("dob_admin_credentials", JSON.stringify(newCreds));

    // Clear form
    setCurrentAdminId("");
    setCurrentAdminPassword("");
    setNewAdminId("");
    setNewAdminPassword("");
    setConfirmNewPassword("");

    toast({
      title: "Admin Credentials Updated",
      description: "Your new credentials are now active. Please use them for your next login.",
    });
  };

  const handleAddModerator = () => {
    if (!newModName || !newModUserId || !newModPassword) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newModPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    // Check if userId already exists
    if (moderators.some(mod => mod.userId === newModUserId)) {
      toast({
        title: "User ID Exists",
        description: "This User ID is already in use",
        variant: "destructive",
      });
      return;
    }

    const newModerator: Moderator = {
      id: crypto.randomUUID(),
      name: newModName,
      userId: newModUserId,
      password: newModPassword,
      createdAt: new Date().toISOString(),
    };

    const updated = [...moderators, newModerator];
    setModerators(updated);
    localStorage.setItem("dob_moderators", JSON.stringify(updated));

    // Clear form
    setNewModName("");
    setNewModUserId("");
    setNewModPassword("");

    toast({
      title: "Moderator Added",
      description: `${newModName} can now log in with their credentials`,
    });
  };

  const handleEditModerator = (mod: Moderator) => {
    setEditingMod(mod.id);
    setEditModName(mod.name);
    setEditModUserId(mod.userId);
    setEditModPassword(mod.password);
  };

  const handleSaveEditModerator = (id: string) => {
    if (!editModName || !editModUserId || !editModPassword) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (editModPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const updated = moderators.map(mod =>
      mod.id === id
        ? { ...mod, name: editModName, userId: editModUserId, password: editModPassword }
        : mod
    );
    setModerators(updated);
    localStorage.setItem("dob_moderators", JSON.stringify(updated));
    setEditingMod(null);

    toast({
      title: "Moderator Updated",
      description: "Moderator credentials have been updated",
    });
  };

  const handleDeleteModerator = (id: string, name: string) => {
    const updated = moderators.filter(mod => mod.id !== id);
    setModerators(updated);
    localStorage.setItem("dob_moderators", JSON.stringify(updated));

    toast({
      title: "Moderator Removed",
      description: `${name} has been removed from moderators`,
    });
  };

  const handleResetAllData = () => {
    localStorage.removeItem("dob_entries");
    localStorage.removeItem("dob_settings");
    localStorage.removeItem("dob_employees");
    localStorage.removeItem("dob_jela_reporters");
    setSettings({
      currentMonth: new Date().toISOString().slice(0, 7),
      employeeOfMonthMessage: "Congratulations to our top performers this month!",
    });
    toast({
      title: "Data Reset",
      description: "All entries and settings have been cleared",
      variant: "destructive",
    });
  };

  const handleToggleFeature = (feature: "voiceArtist" | "attendance" | "workFlow" | "videoUploadTime", enabled: boolean) => {
    const storedFeatures = localStorage.getItem("dob_feature_toggles");
    const currentFeatures = storedFeatures ? JSON.parse(storedFeatures) : {};
    
    const features = {
      ...currentFeatures,
      voiceArtistEnabled: feature === "voiceArtist" ? enabled : (currentFeatures.voiceArtistEnabled ?? voiceArtistEnabled),
      attendanceEnabled: feature === "attendance" ? enabled : (currentFeatures.attendanceEnabled ?? attendanceEnabled),
      workFlowEnabled: feature === "workFlow" ? enabled : (currentFeatures.workFlowEnabled ?? workFlowEnabled),
      videoUploadTimeEnabled: feature === "videoUploadTime" ? enabled : (currentFeatures.videoUploadTimeEnabled ?? videoUploadTimeEnabled),
    };
    
    localStorage.setItem("dob_feature_toggles", JSON.stringify(features));
    
    if (feature === "voiceArtist") {
      setVoiceArtistEnabled(enabled);
    } else if (feature === "attendance") {
      setAttendanceEnabled(enabled);
    } else if (feature === "workFlow") {
      setWorkFlowEnabled(enabled);
    } else {
      setVideoUploadTimeEnabled(enabled);
    }

    const featureName = 
      feature === "voiceArtist" ? "Voice Artist" :
      feature === "attendance" ? "Daily Attendance" :
      feature === "workFlow" ? "Work Flow" :
      "Video Upload Time";
    
    toast({
      title: "Feature Updated",
      description: `${featureName} module ${enabled ? "enabled" : "disabled"}`,
    });
  };

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <div className="w-full px-6 py-6 flex-1">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Admin Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage application settings, credentials, and user access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <CardTitle>General Settings</CardTitle>
                </div>
                <CardDescription>Configure month and award messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentMonth">Current Month for Awards</Label>
                  <Input
                    id="currentMonth"
                    data-testid="input-current-month"
                    type="month"
                    value={settings.currentMonth}
                    onChange={(e) => setSettings({ ...settings, currentMonth: e.target.value })}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set the month for which Employee of the Month awards will be calculated
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Employee of the Month Message</Label>
                  <Textarea
                    id="message"
                    data-testid="input-award-message"
                    value={settings.employeeOfMonthMessage}
                    onChange={(e) => setSettings({ ...settings, employeeOfMonthMessage: e.target.value })}
                    placeholder="Enter custom award message"
                    className="min-h-32 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Customize the message displayed on the rankings page
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {settings.employeeOfMonthMessage.length} characters
                    </span>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="w-full gap-2" data-testid="button-save-settings">
                  <Save className="w-4 h-4" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            {/* Feature Control */}
            <Card className="border-purple-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ToggleLeft className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-purple-700 dark:text-purple-500">Feature Control</CardTitle>
                </div>
                <CardDescription>Enable or disable application modules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="voiceArtistToggle" className="text-base font-medium cursor-pointer">
                      Voice Artist Module
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Manage voice artists, work entries, and billing
                    </p>
                  </div>
                  <Switch
                    id="voiceArtistToggle"
                    checked={voiceArtistEnabled}
                    onCheckedChange={(checked) => handleToggleFeature("voiceArtist", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="attendanceToggle" className="text-base font-medium cursor-pointer">
                      Daily Attendance Module
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Track employee attendance and working hours
                    </p>
                  </div>
                  <Switch
                    id="attendanceToggle"
                    checked={attendanceEnabled}
                    onCheckedChange={(checked) => handleToggleFeature("attendance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="workFlowToggle" className="text-base font-medium cursor-pointer">
                      Work Flow Module
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Visual task management and job assignment dashboard
                    </p>
                  </div>
                  <Switch
                    id="workFlowToggle"
                    checked={workFlowEnabled}
                    onCheckedChange={(checked) => handleToggleFeature("workFlow", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="videoUploadTimeToggle" className="text-base font-medium cursor-pointer">
                      Video Upload Time Module
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Manage daily upload schedule for all video categories
                    </p>
                  </div>
                  <Switch
                    id="videoUploadTimeToggle"
                    checked={videoUploadTimeEnabled}
                    onCheckedChange={(checked) => handleToggleFeature("videoUploadTime", checked)}
                  />
                </div>

                <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-1">Note:</p>
                  <p>When disabled, the corresponding menu options will be hidden from the navigation. All saved data remains intact and will be restored when re-enabled.</p>
                </div>
              </CardContent>
            </Card>

            {/* Change Admin Credentials */}
            <Card className="border-amber-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-amber-700 dark:text-amber-500">Change Admin Login Details</CardTitle>
                </div>
                <CardDescription>Update your admin credentials securely</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAdminId">Current Admin ID</Label>
                  <Input
                    id="currentAdminId"
                    type="text"
                    value={currentAdminId}
                    onChange={(e) => setCurrentAdminId(e.target.value)}
                    placeholder="Enter current admin ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAdminPassword">Current Password</Label>
                  <Input
                    id="currentAdminPassword"
                    type="password"
                    value={currentAdminPassword}
                    onChange={(e) => setCurrentAdminPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newAdminId">New Admin ID</Label>
                    <Input
                      id="newAdminId"
                      type="text"
                      value={newAdminId}
                      onChange={(e) => setNewAdminId(e.target.value)}
                      placeholder="Enter new admin ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newAdminPassword">New Password</Label>
                    <Input
                      id="newAdminPassword"
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <Button onClick={handleChangeAdminCredentials} className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
                  <Key className="w-4 h-4" />
                  Update Admin Credentials
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </div>
                <CardDescription>Irreversible actions that affect all data</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2" data-testid="button-reset-data">
                      <Trash2 className="w-4 h-4" />
                      Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all performance
                        entries, employee data, and reset settings to defaults.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetAllData}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid="button-confirm-reset"
                      >
                        Reset Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Moderator Management */}
          <div className="space-y-6">
            <Card className="border-blue-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-blue-700 dark:text-blue-500">Moderator Management</CardTitle>
                </div>
                <CardDescription>Add and manage moderator accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Moderator Form */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add New Moderator
                  </h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Full Name"
                      value={newModName}
                      onChange={(e) => setNewModName(e.target.value)}
                    />
                    <Input
                      placeholder="User ID"
                      value={newModUserId}
                      onChange={(e) => setNewModUserId(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Password (min 6 characters)"
                      value={newModPassword}
                      onChange={(e) => setNewModPassword(e.target.value)}
                    />
                    <Button onClick={handleAddModerator} className="w-full gap-2" size="sm">
                      <UserPlus className="w-4 h-4" />
                      Add Moderator
                    </Button>
                  </div>
                </div>

                {/* Moderator List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Existing Moderators ({moderators.length})</h3>
                  {moderators.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No moderators yet. Add one above to get started.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {moderators.map((mod, index) => (
                        <div key={mod.id} className="border rounded-lg p-3 space-y-2">
                          {editingMod === mod.id ? (
                            // Edit Mode
                            <div className="space-y-2">
                              <Input
                                placeholder="Name"
                                value={editModName}
                                onChange={(e) => setEditModName(e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                placeholder="User ID"
                                value={editModUserId}
                                onChange={(e) => setEditModUserId(e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                type="password"
                                placeholder="Password"
                                value={editModPassword}
                                onChange={(e) => setEditModPassword(e.target.value)}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleSaveEditModerator(mod.id)}
                                  size="sm"
                                  className="flex-1"
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={() => setEditingMod(null)}
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                                    <p className="font-medium text-sm">{mod.name}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    User ID: <span className="font-mono">{mod.userId}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Password: <span className="font-mono">{"•".repeat(mod.password.length)}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2 border-t">
                                <Button
                                  onClick={() => handleEditModerator(mod)}
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive" className="flex-1 gap-1">
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Moderator?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove <strong>{mod.name}</strong>? They will no longer be able to log in.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteModerator(mod.id, mod.name)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
