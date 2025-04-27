import React, { useState, useRef } from "react"
import { 
  User, Edit, Mail, Calendar, MapPin, Briefcase, Award,  
  GraduationCap, Settings, MessageSquare, Clock, Star, FileText,
  CheckCircle, DollarSign, Save, X, BookOpen, LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Header from "../../student/header/Header"
import { useNavigate } from "react-router-dom"
import signuporloginStore from "../../../zustand/login-signup/store"

// Mock data for the teacher profile
const mockTeacherProfile = {
  personalInfo: {
    name: "Dr. Sarah Chen",
    role: "Senior Computer Science Professor",
    email: "sarah.chen@example.edu",
    phone: "+1 (555) 876-5432",
    location: "Boston, MA",
    bio: "Computer Science professor with 15+ years of experience. Specializing in machine learning, algorithms, and data structures. Passionate about helping students understand complex concepts through practical applications.",
    joinDate: "January 2020",
    avatar: "/placeholder.svg",
    hourlyRate: 85,
    rating: 4.9,
    responseRate: 98,
  },
  stats: {
    doubtsResolved: 432,
    appointmentsCompleted: 189,
    totalHoursTaught: 526,
    earningsThisMonth: 4250,
  },
  upcomingAppointments: [
    {
      id: 1,
      topic: "Machine Learning Algorithms",
      date: "Nov 2, 2023",
      time: "10:00 AM - 11:30 AM",
      status: "confirmed"
    },
    {
      id: 2,
      topic: "Database Design Review",
      date: "Nov 3, 2023",
      time: "2:00 PM - 3:00 PM",
      status: "confirmed"
    },
  ],
  pendingDoubts: 12,
  expertise: [
    { name: "Algorithms", level: 95 },
    { name: "Data Structures", level: 92 },
    { name: "Machine Learning", level: 90 },
    { name: "Python", level: 88 },
    { name: "JavaScript", level: 75 },
  ],
  settings: {
    notifications: {
      email: true,
      browser: true,
      appointmentReminders: true,
      newDoubts: true,
      paymentUpdates: true
    },
    privacy: {
      hideEmail: false,
      hidePhone: true,
    },
    availability: true,
    twoFactorEnabled: false,
  }
};

const TeacherProfilePage = () => {
  const logout = signuporloginStore(state => state.logout);
  const userData = signuporloginStore(state => state.userData);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [profile, setProfile] = useState(mockTeacherProfile);
  const [editMode, setEditMode] = useState({
    bio: false,
    personalInfo: false,
    expertise: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile.personalInfo});
  const [editedExpertise, setEditedExpertise] = useState([...profile.expertise]);
  const [newSkill, setNewSkill] = useState({ name: "", level: 75 });
  const fileInputRef = useRef(null);
  
  // Handle profile changes
  const handleProfileChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };
  
  // Toggle edit mode for different sections
  const toggleEditMode = (section) => {
    if (editMode[section]) {
      saveChanges(section);
    } else {
      if (section === 'bio') {
        setEditedProfile({...editedProfile, bio: profile.personalInfo.bio});
      } else if (section === 'expertise') {
        setEditedExpertise([...profile.expertise]);
      }
    }
    
    setEditMode({...editMode, [section]: !editMode[section]});
  };

  // Save changes from edit mode
  const saveChanges = (section) => {
    if (section === 'bio' || section === 'personalInfo') {
      setProfile({
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          ...(section === 'bio' ? { bio: editedProfile.bio } : editedProfile)
        }
      });
    } else if (section === 'expertise') {
      setProfile({
        ...profile,
        expertise: [...editedExpertise]
      });
    }
  };

  // Handle upload profile photo
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload the file to a server
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            avatar: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Skills management
  const handleSkillLevelChange = (index, level) => {
    const updated = [...editedExpertise];
    updated[index].level = parseInt(level);
    setEditedExpertise(updated);
  };

  const handleRemoveSkill = (index) => {
    setEditedExpertise(editedExpertise.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return;
    setEditedExpertise([...editedExpertise, { ...newSkill }]);
    setNewSkill({ name: "", level: 75 });
  };

  // Save notification settings
  const handleSettingsChange = (category, setting, value) => {
    setProfile({
      ...profile,
      settings: {
        ...profile.settings,
        [category]: {
          ...profile.settings[category],
          [setting]: value
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-[8rem] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text">Teacher Dashboard</h1>
              <p className="text-text-muted">Welcome back, Dr. Chen</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                className="border-border text-text-muted hover:text-text"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-border text-accent hover:text-accent/80 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card border-border shadow-lg">
                <CardContent className="p-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-secondary">
                        <AvatarImage src={profile.personalInfo.avatar} />
                        <AvatarFallback className="bg-muted text-secondary text-xl">
                          {profile.personalInfo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <button 
                        className="absolute bottom-0 right-0 bg-secondary text-white rounded-full p-1.5 shadow-md hover:bg-secondary/90 transition-colors"
                        onClick={handleUploadClick}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    {/* Profile Name & Role */}
                    <div className="mt-4 text-center">
                      {editMode.personalInfo ? (
                        <div className="space-y-2">
                          <Input 
                            className="bg-muted border-border text-text text-center" 
                            name="name"
                            value={editedProfile.name}
                            onChange={handleProfileChange}
                            placeholder="Full Name"
                          />
                          <Input 
                            className="bg-muted border-border text-text text-center" 
                            name="role"
                            value={editedProfile.role}
                            onChange={handleProfileChange}
                            placeholder="Professional Title"
                          />
                        </div>
                      ) : (
                        <div className="relative group">
                          <h2 className="text-xl font-bold text-text mt-2">{profile.personalInfo.name}</h2>
                          <p className="text-text-muted text-sm">{profile.personalInfo.role}</p>
                          <button 
                            className="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleEditMode('personalInfo')}
                          >
                            <Edit className="h-4 w-4 text-text-muted hover:text-secondary" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 font-semibold text-text">{profile.personalInfo.rating}</span>
                      </div>
                    </div>
                    
                    {editMode.personalInfo ? (
                      <div className="space-y-4 mt-6 w-full">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-secondary mr-3" />
                          <Input 
                            className="bg-muted border-border text-text flex-1" 
                            name="email"
                            value={editedProfile.email}
                            onChange={handleProfileChange}
                            placeholder="Email Address"
                          />
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-secondary mr-3" />
                          <Input 
                            className="bg-muted border-border text-text flex-1" 
                            name="location"
                            value={editedProfile.location}
                            onChange={handleProfileChange}
                            placeholder="Location"
                          />
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-secondary mr-3" />
                          <Input 
                            className="bg-muted border-border text-text flex-1" 
                            name="hourlyRate"
                            type="number"
                            value={editedProfile.hourlyRate}
                            onChange={handleProfileChange}
                            placeholder="Hourly Rate"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-border text-text-muted hover:text-text"
                            onClick={() => setEditMode({...editMode, personalInfo: false})}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-secondary hover:bg-secondary/90 text-white"
                            onClick={() => toggleEditMode('personalInfo')}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6 w-full">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-secondary mr-3" />
                          <div className="text-text-muted text-sm">{profile.personalInfo.email}</div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-secondary mr-3" />
                          <div className="text-text-muted text-sm">{profile.personalInfo.location}</div>
                        </div>
                        <div className="flex items-center relative group">
                          <DollarSign className="h-5 w-5 text-secondary mr-3" />
                          <div className="text-text-muted text-sm">${profile.personalInfo.hourlyRate}/hour</div>
                          <button 
                            className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleEditMode('hourlyRate')}
                          >
                            <Edit className="h-4 w-4 text-text-muted hover:text-secondary" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 border-t border-border/50 pt-5 w-full">
                      <div className="relative group">
                        <h3 className="text-lg font-medium text-text mb-2">About Me</h3>
                        {editMode.bio ? (
                          <div>
                            <Textarea 
                              className="bg-muted border-border text-text min-h-[120px] mb-3" 
                              name="bio"
                              value={editedProfile.bio}
                              onChange={handleProfileChange}
                              placeholder="Write something about yourself..."
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border text-text-muted hover:text-text"
                                onClick={() => setEditMode({...editMode, bio: false})}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-secondary hover:bg-secondary/90 text-white"
                                onClick={() => toggleEditMode('bio')}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-text-muted">{profile.personalInfo.bio}</p>
                            <button 
                              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => toggleEditMode('bio')}
                            >
                              <Edit className="h-4 w-4 text-text-muted hover:text-secondary" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border shadow-md">
                  <CardContent className="p-4 flex flex-col items-center">
                    <CheckCircle className="h-6 w-6 text-secondary mb-2" />
                    <div className="text-2xl font-bold text-text">{profile.stats.doubtsResolved}</div>
                    <p className="text-xs text-text-muted">Doubts Resolved</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-md">
                  <CardContent className="p-4 flex flex-col items-center">
                    <DollarSign className="h-6 w-6 text-secondary mb-2" />
                    <div className="text-2xl font-bold text-text">${profile.stats.earningsThisMonth}</div>
                    <p className="text-xs text-text-muted">This Month</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teaching Expertise */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center text-text">
                        <BookOpen className="mr-2 h-5 w-5 text-secondary" /> 
                        Teaching Expertise
                      </CardTitle>
                      <CardDescription className="text-text-muted">
                        Your specialized teaching areas and skill ratings
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-border text-text-muted hover:text-text"
                      onClick={() => toggleEditMode('expertise')}
                    >
                      {editMode.expertise ? "Save Changes" : "Edit Skills"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editMode.expertise ? (
                    <div className="space-y-5">
                      {editedExpertise.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <Input 
                                className="bg-muted border-border text-text w-64"
                                value={skill.name}
                                onChange={(e) => {
                                  const updated = [...editedExpertise];
                                  updated[index].name = e.target.value;
                                  setEditedExpertise(updated);
                                }}
                              />
                              <span className="text-text-muted text-sm">{skill.level}%</span>
                            </div>
                            <Input
                              type="range"
                              min="10"
                              max="100"
                              value={skill.level}
                              onChange={(e) => handleSkillLevelChange(index, e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-0 h-8 w-8"
                            onClick={() => handleRemoveSkill(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="border-t border-border/50 pt-5 mt-5">
                        <h4 className="text-sm font-medium text-text mb-3">Add New Skill</h4>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <Label htmlFor="new-skill" className="text-text-muted mb-1 block">Skill Name</Label>
                            <Input 
                              id="new-skill"
                              className="bg-muted border-border text-text"
                              placeholder="e.g., React, Docker, etc."
                              value={newSkill.name}
                              onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                            />
                          </div>
                          <div className="w-24">
                            <Label htmlFor="new-skill-level" className="text-text-muted mb-1 block">Level (%)</Label>
                            <Input 
                              id="new-skill-level"
                              className="bg-muted border-border text-text"
                              type="number"
                              min="10"
                              max="100"
                              value={newSkill.level}
                              onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                            />
                          </div>
                          <Button 
                            className="bg-secondary hover:bg-secondary/90 text-white"
                            onClick={handleAddSkill}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {profile.expertise.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <h3 className="text-text font-medium">{skill.name}</h3>
                              {skill.level > 90 && (
                                <Badge className="ml-2 bg-secondary/10 text-secondary border-secondary/30 text-xs">
                                  Expert
                                </Badge>
                              )}
                            </div>
                            <span className="text-text-muted text-sm">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2 bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                skill.level > 90 ? "bg-secondary" : "bg-blue-500"
                              }`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </Progress>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Upcoming Sessions */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center text-text">
                    <Calendar className="mr-2 h-5 w-5 text-secondary" /> 
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {profile.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-text">{appointment.topic}</h3>
                            <div className="flex items-center mt-1 text-xs text-text-muted">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{appointment.date}, {appointment.time}</span>
                            </div>
                          </div>
                          <Badge className={appointment.status === "confirmed" 
                            ? "bg-green-500/10 text-green-500 border-green-500/30" 
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                          }>
                            {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Pending Doubts Card */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-text">
                      <MessageSquare className="mr-2 h-5 w-5 text-secondary" /> 
                      Pending Doubts
                    </CardTitle>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                      {profile.pendingDoubts} New
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-center py-4">
                    <Button className="bg-secondary hover:bg-secondary/90 text-white mb-2">
                      Answer Student Doubts
                    </Button>
                    <p className="text-sm text-text-muted">
                      Answering doubts promptly improves your teacher ratings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      {showSettings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="bg-card text-text border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Account Settings</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium text-text mb-3">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-text-muted">Email Notifications</Label>
                    <Switch 
                      id="email-notifications" 
                      checked={profile.settings.notifications.email}
                      onCheckedChange={(checked) => handleSettingsChange('notifications', 'email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appointment-reminders" className="text-text-muted">Appointment Reminders</Label>
                    <Switch 
                      id="appointment-reminders" 
                      checked={profile.settings.notifications.appointmentReminders}
                      onCheckedChange={(checked) => handleSettingsChange('notifications', 'appointmentReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-doubts" className="text-text-muted">New Doubts Alerts</Label>
                    <Switch 
                      id="new-doubts" 
                      checked={profile.settings.notifications.newDoubts}
                      onCheckedChange={(checked) => handleSettingsChange('notifications', 'newDoubts', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-text mb-3">Privacy Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide-email" className="text-text-muted">Hide Email Address</Label>
                    <Switch 
                      id="hide-email" 
                      checked={profile.settings.privacy.hideEmail}
                      onCheckedChange={(checked) => handleSettingsChange('privacy', 'hideEmail', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide-phone" className="text-text-muted">Hide Phone Number</Label>
                    <Switch 
                      id="hide-phone" 
                      checked={profile.settings.privacy.hidePhone}
                      onCheckedChange={(checked) => handleSettingsChange('privacy', 'hidePhone', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white"
                onClick={() => setShowSettings(false)}
              >
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default TeacherProfilePage 