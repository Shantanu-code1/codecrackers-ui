import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, Edit, Mail, Calendar, MapPin, Briefcase, Award, Book, 
  GraduationCap, Settings, Code, ExternalLink, MessageSquare, 
  CheckCircle, Clock, Star, FileText, Grid, Key, Shield, 
  Save, Bell, Moon, Sun, LogOut, Zap
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PrimaryButton, SecondaryButton } from "@/components/ui/custom-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "../doubts/ui/rich-text"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "../doubts/ui/multi-select"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import Header from "../header/Header"
import { useNavigate } from "react-router-dom"
import signuporloginStore from "../../../zustand/login-signup/store"

// Mock data for the profile
const mockProfileData = {
  personalInfo: {
    name: "Alex Johnson",
    role: "Computer Science Student",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate student developer with interest in AI and machine learning. Currently pursuing a Computer Science degree and working on personal projects to enhance my skills.",
    joinDate: "September 2023",
    avatar: "/placeholder.svg",
  },
  stats: {
    problemsSolved: 246,
    streak: 8,
    rank: 423,
    contributions: 35
  },
  socialLinks: {
    github: "github.com/alexjohnson",
    twitter: "twitter.com/alexcode",
    linkedin: "linkedin.com/in/alexjohnson",
    website: "alexjohnson.dev"
  },
  skills: [
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
    { name: "Python", level: 75 },
    { name: "Node.js", level: 70 },
    { name: "Machine Learning", level: 60 },
    { name: "Data Structures", level: 85 },
    { name: "Algorithms", level: 80 },
  ],
  projects: [
    {
      id: 1,
      title: "AI Study Assistant",
      technologies: ["Python", "TensorFlow", "React"],
      description: "An AI-powered application that helps students organize study materials and provides personalized learning recommendations.",
      link: "https://github.com/alexjohnson/ai-study-assistant"
    },
    {
      id: 2,
      title: "Code Analyzer",
      technologies: ["JavaScript", "Node.js", "Express"],
      description: "A tool that analyzes code quality and suggests improvements based on best practices.",
      link: "https://github.com/alexjohnson/code-analyzer"
    }
  ],
  education: [
    {
      id: 1,
      institution: "Stanford University",
      degree: "Bachelor of Science in Computer Science",
      period: "2022 - Present",
      description: "Focusing on AI and Machine Learning. Current GPA: 3.8/4.0",
    },
    {
      id: 2,
      institution: "Tech Preparatory High School",
      degree: "High School Diploma",
      period: "2018 - 2022",
      description: "Graduated with honors. President of the Coding Club.",
    },
  ],
  experience: [
    {
      id: 1,
      company: "TechStart Innovations",
      position: "Software Development Intern",
      period: "Summer 2024",
      description: "Worked on front-end development using React. Implemented responsive UIs and integrated APIs.",
    },
    {
      id: 2,
      company: "CodeCamp",
      position: "Teaching Assistant",
      period: "Fall 2023",
      description: "Assisted in teaching introductory programming concepts to first-year students.",
    },
  ],
  achievements: [
    {
      id: 1,
      title: "Hackathon Winner",
      date: "March 2024",
      description: "First place in university hackathon for developing an AI-powered study assistant.",
    },
    {
      id: 2,
      title: "Dean's List",
      date: "2022-2023",
      description: "Recognized for academic excellence for two consecutive semesters.",
    },
    {
      id: 3,
      title: "Open Source Contributor",
      date: "Ongoing",
      description: "Active contributor to various open source projects with over 50 accepted pull requests.",
    },
  ],
  courses: [
    {
      id: 1,
      title: "Advanced Machine Learning",
      provider: "Stanford University",
      completion: "May 2024",
      certificate: true,
    },
    {
      id: 2,
      title: "Full Stack Development",
      provider: "Codecademy",
      completion: "January 2024",
      certificate: true,
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      provider: "Stanford University",
      completion: "December 2023",
      certificate: false,
    },
  ],
}

const ProfilePage = () => {
  const logout = signuporloginStore(state => state.logout);
  const userData = signuporloginStore(state => state.userData);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const [profile, setProfile] = useState(mockProfileData)
  const [activeTab, setActiveTab] = useState("overview")
  const [editMode, setEditMode] = useState({
    personalInfo: false,
    bio: false,
    skills: false,
  })
  const [newSkill, setNewSkill] = useState({ name: "", level: 50 })
  const [tempPersonalInfo, setTempPersonalInfo] = useState(profile.personalInfo)
  const [availableSkills, setAvailableSkills] = useState([
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "react", label: "React" },
    { value: "node", label: "Node.js" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "rust", label: "Rust" },
    { value: "scala", label: "Scala" },
    { value: "typescript", label: "TypeScript" },
    { value: "php", label: "PHP" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
    { value: "mongodb", label: "MongoDB" },
    { value: "aws", label: "AWS" },
    { value: "docker", label: "Docker" },
    { value: "kubernetes", label: "Kubernetes" },
    { value: "linux", label: "Linux" },
    { value: "git", label: "Git" },
    { value: "algorithms", label: "Algorithms" },
    { value: "data-structures", label: "Data Structures" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "deep-learning", label: "Deep Learning" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "data-science", label: "Data Science" },
  ])

  const toggleEditMode = (section) => {
    if (section === "personalInfo" && !editMode.personalInfo) {
      setTempPersonalInfo({ ...profile.personalInfo })
    }
    
    setEditMode({
      ...editMode,
      [section]: !editMode[section],
    })
    
    if (editMode[section]) {
      // Save was clicked, update with changes if necessary
      if (section === "personalInfo") {
        setProfile({
          ...profile,
          personalInfo: tempPersonalInfo,
        })
      }
    }
  }

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setTempPersonalInfo({
      ...tempPersonalInfo,
      [name]: value,
    })
  }

  const handleBioChange = (content) => {
    setTempPersonalInfo({
      ...tempPersonalInfo,
      bio: content,
    })
  }

  const addSkill = () => {
    if (newSkill.name) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      })
      setNewSkill({ name: "", level: 50 })
    }
  }

  const removeSkill = (skillName) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill.name !== skillName),
    })
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-[8rem] pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-gradient-to-b from-secondary/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-t from-secondary/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-secondary/20 to-secondary/5 relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/30"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Cover
                </Button>
              </div>
              
              <CardContent className="p-6 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-6 ring-4 ring-card rounded-full">
                  <Avatar className="h-24 w-24 border-4 border-card">
                    <AvatarImage src={profile.personalInfo.avatar} alt={profile.personalInfo.name} />
                    <AvatarFallback className="bg-muted text-text text-2xl">
                      {profile.personalInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="mt-10 sm:mt-0 sm:ml-32 flex flex-col sm:flex-row justify-between">
                  <div>
                    {editMode.personalInfo ? (
                      <div className="space-y-4 max-w-md">
                        <Input 
                          value={profile.personalInfo.name} 
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: {
                              ...profile.personalInfo,
                              name: e.target.value
                            }
                          })}
                          className="bg-muted border-border text-text"
                        />
                        <Input 
                          value={profile.personalInfo.role} 
                          onChange={(e) => setProfile({
                            ...profile,
                            personalInfo: {
                              ...profile.personalInfo,
                              role: e.target.value
                            }
                          })}
                          className="bg-muted border-border text-text"
                        />
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => toggleEditMode("personalInfo")}
                            className="border-border text-text hover:bg-muted"
                          >
                            Cancel
                          </Button>
                          <PrimaryButton onClick={() => toggleEditMode("personalInfo")}>
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                          </PrimaryButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-text">{profile.personalInfo.name}</h2>
                        <p className="text-secondary">{profile.personalInfo.role}</p>
                        <div className="flex flex-wrap gap-y-2 mt-2">
                          <div className="flex items-center mr-4 text-text-muted">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="text-sm">{profile.personalInfo.email}</span>
                          </div>
                          <div className="flex items-center mr-4 text-text-muted">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{profile.personalInfo.location}</span>
                          </div>
                          <div className="flex items-center text-text-muted">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">Joined {profile.personalInfo.joinDate}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {!editMode.personalInfo && (
                    <div className="mt-4 sm:mt-0 flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => toggleEditMode("personalInfo")}
                        className="border-border text-text hover:bg-muted"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit Profile
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
                  )}
                </div>
                
                {/* Bio Section */}
                <div className="mt-6">
                  {editMode.bio ? (
                    <div className="space-y-4">
                      <Textarea 
                        value={profile.personalInfo.bio} 
                        onChange={(e) => setProfile({
                          ...profile,
                          personalInfo: {
                            ...profile.personalInfo,
                            bio: e.target.value
                          }
                        })}
                        className="bg-muted border-border text-text min-h-[100px]"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => toggleEditMode("bio")}
                          className="border-border text-text hover:bg-muted"
                        >
                          Cancel
                        </Button>
                        <PrimaryButton onClick={() => toggleEditMode("bio")}>
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </PrimaryButton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <p className="text-text-muted">{profile.personalInfo.bio}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleEditMode("bio")}
                        className="text-text-muted hover:text-text hover:bg-muted h-8"
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Stats Row */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-text">{profile.stats.problemsSolved}</div>
                    <div className="text-sm text-text-muted">Problems Solved</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">{profile.stats.streak} days</div>
                    <div className="text-sm text-text-muted">Current Streak</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-text">#{profile.stats.rank}</div>
                    <div className="text-sm text-text-muted">Global Rank</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-text">{profile.stats.contributions}</div>
                    <div className="text-sm text-text-muted">Contributions</div>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`https://${profile.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-muted px-3 py-1.5 rounded-full text-text-muted hover:text-secondary transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="text-sm">GitHub</span>
                  </a>
                  <a href={`https://${profile.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-muted px-3 py-1.5 rounded-full text-text-muted hover:text-secondary transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="text-sm">Twitter</span>
                  </a>
                  <a href={`https://${profile.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-muted px-3 py-1.5 rounded-full text-text-muted hover:text-secondary transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a href={`https://${profile.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-muted px-3 py-1.5 rounded-full text-text-muted hover:text-secondary transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="text-sm">Website</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs Navigation */}
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-8"
          >
            <TabsList className="bg-card border border-border grid grid-cols-5 h-auto p-1 w-full sm:w-auto">
              <TabsTrigger 
                value="overview" 
                className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
              >
                <User className="h-4 w-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
              >
                <GraduationCap className="h-4 w-4 mr-2" /> Education
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
              >
                <Briefcase className="h-4 w-4 mr-2" /> Experience
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
              >
                <Award className="h-4 w-4 mr-2" /> Achievements
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="py-2.5 data-[state=active]:bg-secondary data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="md:col-span-2 space-y-6">
                  {/* Skills Card */}
                  <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl flex items-center text-text">
                          <Code className="mr-2 h-5 w-5 text-secondary" /> Skills
                        </CardTitle>
                        {!editMode.skills && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleEditMode("skills")}
                            className="border-border text-text hover:bg-muted"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit Skills
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {editMode.skills ? (
                        <div className="space-y-6">
                          {profile.skills.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex gap-4">
                                <Input 
                                  value={skill.name} 
                                  onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[index].name = e.target.value;
                                    setProfile({...profile, skills: newSkills});
                                  }}
                                  className="bg-muted border-border text-text"
                                  placeholder="Skill name"
                                />
                                <Input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={skill.level} 
                                  onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[index].level = parseInt(e.target.value) || 0;
                                    setProfile({...profile, skills: newSkills});
                                  }}
                                  className="bg-muted border-border text-text w-24"
                                  placeholder="Level"
                                />
                              </div>
                              <Progress 
                                value={skill.level} 
                                className="h-2.5 bg-muted" 
                                style={{
                                  "--progress-background": skill.color || "var(--secondary)"
                                }}
                              />
                            </div>
                          ))}
                          
                          <div className="flex space-x-2 pt-4">
                            <Button 
                              variant="outline" 
                              onClick={() => toggleEditMode("skills")}
                              className="border-border text-text hover:bg-muted"
                            >
                              Cancel
                            </Button>
                            <PrimaryButton onClick={() => toggleEditMode("skills")}>
                              <Save className="h-4 w-4 mr-2" /> Save Changes
                            </PrimaryButton>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {profile.skills.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="text-text">{skill.name}</div>
                                <div className="text-text-muted text-sm">{skill.level}%</div>
                              </div>
                              <Progress 
                                value={skill.level} 
                                className="h-2.5 bg-muted" 
                                style={{
                                  "--progress-background": skill.color || "var(--secondary)"
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Recent Activity */}
                  <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-xl flex items-center text-text">
                        <Clock className="mr-2 h-5 w-5 text-secondary" /> Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {[
                          { type: "doubt", title: "Asked question about React hooks", date: "2 days ago", icon: MessageSquare },
                          { type: "solution", title: "Submitted solution for Array problem", date: "1 week ago", icon: CheckCircle },
                          { type: "achievement", title: "Earned 'Problem Solver' badge", date: "2 weeks ago", icon: Award },
                          { type: "contribution", title: "Answered question about Python", date: "1 month ago", icon: Star },
                        ].map((activity, i) => (
                          <div key={i} className="p-4 flex items-start">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                              {React.createElement(activity.icon, { className: "w-4 h-4 text-secondary" })}
                            </div>
                            <div>
                              <p className="text-sm text-text">{activity.title}</p>
                              <p className="text-xs text-text-muted mt-1">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Courses Card */}
                  <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-xl flex items-center text-text">
                        <Book className="mr-2 h-5 w-5 text-secondary" /> Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {profile.courses.map((course) => (
                          <div key={course.id} className="p-4">
                            <h3 className="font-medium text-text">{course.title}</h3>
                            <p className="text-sm text-text-muted">{course.provider}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-text-muted">{course.completion}</span>
                              {course.certificate && (
                                <Badge className="bg-secondary/20 text-secondary border border-secondary/30">
                                  Certificate
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Learning Path */}
                  <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-xl flex items-center text-text">
                        <FileText className="mr-2 h-5 w-5 text-secondary" /> Learning Path
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-secondary"></div>
                          <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border h-full"></div>
                          <div>
                            <h3 className="font-medium text-text">Data Structures</h3>
                            <p className="text-sm text-text-muted">Completed</p>
                          </div>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-secondary"></div>
                          <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border h-full"></div>
                          <div>
                            <h3 className="font-medium text-text">Algorithms</h3>
                            <p className="text-sm text-text-muted">In Progress - 75%</p>
                            <Progress value={75} className="h-1.5 mt-2 bg-muted" />
                          </div>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-muted"></div>
                          <div className="absolute left-1.5 top-4 bottom-0 w-px bg-border h-full"></div>
                          <div>
                            <h3 className="font-medium text-text-muted">System Design</h3>
                            <p className="text-sm text-text-muted">Upcoming</p>
                          </div>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-muted"></div>
                          <div>
                            <h3 className="font-medium text-text-muted">Machine Learning</h3>
                            <p className="text-sm text-text-muted">Unlocks after System Design</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="education">
              <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center text-text">
                      <GraduationCap className="mr-2 h-5 w-5 text-secondary" /> Education
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-text hover:bg-muted"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {profile.education.map((edu, index) => (
                      <div key={edu.id} className="relative">
                        {/* Timeline dot and line */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-secondary"></div>
                          {index < profile.education.length - 1 && (
                            <div className="w-px flex-1 bg-border"></div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="ml-8 bg-card/50 p-4 rounded-lg border border-border/50">
                          <h3 className="text-lg font-medium text-text">{edu.institution}</h3>
                          <p className="text-secondary">{edu.degree}</p>
                          <div className="flex items-center mt-1 mb-2 text-text-muted">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{edu.period}</span>
                          </div>
                          <p className="text-text">{edu.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center text-text">
                      <Briefcase className="mr-2 h-5 w-5 text-secondary" /> Work Experience
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-text hover:bg-muted"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {profile.experience.map((exp, index) => (
                      <div key={exp.id} className="relative">
                        {/* Timeline dot and line */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-secondary"></div>
                          {index < profile.experience.length - 1 && (
                            <div className="w-px flex-1 bg-border"></div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="ml-8 bg-card/50 p-4 rounded-lg border border-border/50">
                          <h3 className="text-lg font-medium text-text">{exp.company}</h3>
                          <p className="text-secondary">{exp.position || exp.role}</p>
                          <div className="flex items-center mt-1 mb-2 text-text-muted">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{exp.period}</span>
                          </div>
                          <p className="text-text">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="bg-gradient-to-br from-card to-card/80 border-border shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-xl flex items-center text-text">
                    <Award className="mr-2 h-5 w-5 text-secondary" /> Achievements & Certifications
                  </CardTitle>
                  <CardDescription className="text-text-muted">
                    Your noteworthy accomplishments and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="h-full bg-card border border-border hover:shadow-md transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold text-secondary">{achievement.title}</h3>
                              <Badge className="bg-secondary/10 text-secondary">{achievement.date}</Badge>
                            </div>
                            <p className="mt-3 text-text-muted">{achievement.description}</p>
                            <div className="mt-4 flex justify-end">
                              <Button variant="ghost" size="sm" className="text-secondary">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-card text-white">
                  <CardTitle className="text-xl flex items-center">
                    <Settings className="mr-2 h-5 w-5" /> Profile Settings
                  </CardTitle>
                  <CardDescription className="text-text-muted">
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-text mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border">
                          <div>
                            <h4 className="font-medium text-text">Email Notifications</h4>
                            <p className="text-sm text-text-muted">Receive email updates about your account</p>
                          </div>
                          <Switch />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">Email Address</label>
                          <Input 
                            type="email" 
                            value={profile.personalInfo.email} 
                            className="bg-muted border-border text-text"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">Profile Visibility</label>
                          <Select defaultValue="public">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Who can see your profile" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="students">Students Only</SelectItem>
                              <SelectItem value="connections">Connections Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-text mb-4">Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">Current Password</label>
                          <Input type="password" placeholder="Enter your current password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">New Password</label>
                          <Input type="password" placeholder="Enter your new password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">Confirm New Password</label>
                          <Input type="password" placeholder="Confirm your new password" />
                        </div>
                        <Button className="bg-secondary hover:bg-secondary/90 text-white">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                      <div className="border border-destructive/20 rounded-md p-4 bg-destructive/5">
                        <h4 className="text-base font-medium text-destructive mb-2">Delete Account</h4>
                        <p className="text-destructive/80 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default ProfilePage 