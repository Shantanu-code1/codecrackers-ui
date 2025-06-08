import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Edit, Mail, LogOut, Save, Camera, MapPin, Calendar, User, TrendingDown, AlertTriangle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/ui/custom-button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Header from "../header/Header"
import { useNavigate } from "react-router-dom"
import signuporloginStore from "../../../zustand/login-signup/store"

const ProfilePage = () => {
  const logout = signuporloginStore(state => state.logout);
  const userData = signuporloginStore(state => state.userData);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const [profile, setProfile] = useState({
    personalInfo: {
      name: userData?.name || "User",
      email: userData?.email || "",
      avatar: userData?.profileImage || "/placeholder.svg",
      bio: userData?.bio || "Student at niqSolve platform",
      location: userData?.location || "India",
      joinDate: userData?.joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    doubtStreak: {
      current: userData?.doubtStreak || 5,
      longest: userData?.longestDoubtStreak || 12,
      lastDoubtDate: userData?.lastDoubtDate || new Date().toISOString().split('T')[0]
    },
    stats: {
      doubtsSolved: userData?.doubtsSolved || 23,
      totalDoubts: userData?.totalDoubts || 31
    },
    improvementAreas: userData?.improvementAreas || [
      { topic: "JavaScript Async/Await", successRate: 45, priority: "high", doubtsCount: 8 },
      { topic: "SQL Joins", successRate: 60, priority: "medium", doubtsCount: 5 },
      { topic: "React Hooks", successRate: 70, priority: "low", doubtsCount: 3 }
    ]
  });

  const [editMode, setEditMode] = useState(false)
  const [tempPersonalInfo, setTempPersonalInfo] = useState(profile.personalInfo)
  const fileInputRef = useRef(null)

  const toggleEditMode = () => {
    if (!editMode) {
      setTempPersonalInfo({ ...profile.personalInfo })
    } else {
      // Save changes
      setProfile({
        ...profile,
        personalInfo: tempPersonalInfo,
      })
    }
    setEditMode(!editMode)
  }

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setTempPersonalInfo({
      ...tempPersonalInfo,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempPersonalInfo({
          ...tempPersonalInfo,
          avatar: e.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    if (editMode) {
      fileInputRef.current?.click()
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-[8rem] pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-secondary/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-secondary/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-xl rounded-xl overflow-hidden">
              <CardContent className="p-8">
                {/* Profile Section */}
                <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="relative">
                      <Avatar className="h-32 w-32 cursor-pointer" onClick={handleImageClick}>
                        <AvatarImage src={editMode ? tempPersonalInfo.avatar : profile.personalInfo.avatar} alt={profile.personalInfo.name} />
                        <AvatarFallback className="bg-muted text-text text-3xl">
                          {profile.personalInfo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {editMode && (
                        <Button 
                          size="sm" 
                          onClick={handleImageClick}
                          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-secondary hover:bg-secondary/90"
                        >
                          <Camera className="h-5 w-5" />
                        </Button>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    {editMode && (
                      <p className="text-xs text-text-muted mt-2 text-center">Click to change photo</p>
                    )}
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1 space-y-6">
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                            <Input 
                              name="name"
                              value={tempPersonalInfo.name} 
                              onChange={handlePersonalInfoChange}
                              className="bg-muted border-border text-text"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
                            <Input 
                              name="email"
                              type="email"
                              value={tempPersonalInfo.email} 
                              onChange={handlePersonalInfoChange}
                              className="bg-muted border-border text-text"
                              placeholder="Your email"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-2">Location</label>
                          <Input 
                            name="location"
                            value={tempPersonalInfo.location} 
                            onChange={handlePersonalInfoChange}
                            className="bg-muted border-border text-text"
                            placeholder="Your location"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-2">Bio</label>
                          <Textarea 
                            name="bio"
                            value={tempPersonalInfo.bio} 
                            onChange={handlePersonalInfoChange}
                            className="bg-muted border-border text-text min-h-[80px]"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-3xl font-bold text-text mb-2">{profile.personalInfo.name}</h2>
                          <p className="text-text-muted mb-4">{profile.personalInfo.bio}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{profile.personalInfo.email}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{profile.personalInfo.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Joined {profile.personalInfo.joinDate}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      {editMode ? (
                        <>
                          <PrimaryButton onClick={toggleEditMode}>
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                          </PrimaryButton>
                          <Button 
                            variant="outline" 
                            onClick={toggleEditMode}
                            className="border-border text-text hover:bg-muted"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={toggleEditMode}
                            className="border-border text-text hover:bg-muted"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit Profile
                          </Button>
                          <Button 
                            onClick={handleLogout}
                            variant="outline" 
                            className="border-border text-accent hover:text-accent/80"
                          >
                            <LogOut className="h-4 w-4 mr-2" /> Logout
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-xl rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-text mb-2">Performance Overview</h2>
                  <p className="text-text-muted">Track your learning progress and achievements</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Doubt Asking Streak */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-6 border border-orange-500/20 hover:shadow-lg transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔥</div>
                      <h3 className="text-2xl font-bold text-orange-400 mb-2">{profile.doubtStreak.current} Days</h3>
                      <p className="text-text-muted mb-4">Asking Streak</p>
                      
                      <div className="space-y-3 text-sm">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="font-medium text-text">Current Streak</div>
                          <div className="text-orange-400 font-bold">{profile.doubtStreak.current} days</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="font-medium text-text">Longest Streak</div>
                          <div className="text-secondary font-bold">{profile.doubtStreak.longest} days</div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-text-muted mt-4">
                        Keep asking questions daily!
                      </p>
                    </div>
                  </div>
                  
                  {/* Doubts Solved */}
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20 hover:shadow-lg transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-2">✅</div>
                      <h3 className="text-2xl font-bold text-green-400 mb-2">{profile.stats.doubtsSolved}</h3>
                      <p className="text-text-muted mb-4">Doubts Solved</p>
                      
                      <div className="space-y-3 text-sm">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="font-medium text-text">Total Doubts</div>
                          <div className="text-text font-bold">{profile.stats.totalDoubts}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="font-medium text-text">Success Rate</div>
                          <div className="text-green-400 font-bold">
                            {Math.round((profile.stats.doubtsSolved / profile.stats.totalDoubts) * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-text-muted mt-4">
                        Great problem-solving progress!
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-6 border border-blue-500/20 hover:shadow-lg transition-all duration-300">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl mb-2">⚡</div>
                        <h4 className="text-lg font-semibold text-text mb-4">Quick Actions</h4>
                      </div>
                      
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                        <User className="h-4 w-4 mr-2" />
                        Ask a Question
                      </Button>
                      <Button variant="outline" className="w-full border-border text-text hover:bg-muted">
                        <Edit className="h-4 w-4 mr-2" />
                        View My Doubts
                      </Button>
                      
                      <div className="pt-4 border-t border-border/30">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-sm text-text-muted text-center">
                            <p className="font-medium text-text">Last Activity</p>
                            <p className="text-secondary font-bold">{new Date(profile.doubtStreak.lastDoubtDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Improvement Areas Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-xl rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <TrendingDown className="h-6 w-6 text-red-400 mr-3" />
                    <h2 className="text-2xl font-bold text-text">Key Areas to Improve</h2>
                  </div>
                  <p className="text-text-muted">Focus on these topics to boost your success rate</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-500/5 to-red-600/3 rounded-xl p-6 border border-red-500/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.improvementAreas.map((area, index) => (
                        <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border/30">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-text mb-1">{area.topic}</h4>
                              <p className="text-sm text-text-muted">{area.doubtsCount} doubts posted</p>
                            </div>
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              area.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              area.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {area.priority === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {area.priority.toUpperCase()}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-text-muted">Success Rate</span>
                              <span className={`font-bold ${
                                area.successRate < 50 ? 'text-red-400' :
                                area.successRate < 70 ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {area.successRate}%
                              </span>
                            </div>
                            
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  area.successRate < 50 ? 'bg-red-400' :
                                  area.successRate < 70 ? 'bg-yellow-400' :
                                  'bg-green-400'
                                }`}
                                style={{ width: `${area.successRate}%` }}
                              ></div>
                            </div>
                            
                            <div className="pt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-full text-xs border-border text-text hover:bg-muted"
                              >
                                Practice {area.topic}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center text-sm text-text-muted">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                      <span>Focus on high-priority areas first. Practice regularly to improve your success rate!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage 