import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, AlertCircle, PlusCircle, LayoutGrid, List, RefreshCw, CheckSquare } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useProblemsOfTheDay } from '@/hooks/useProblemOfTheDay';
import useAdminStore from '@/zustand/admin/store';
import { toast } from 'react-toastify';
import { useMarkPotdSolved } from '@/hooks/useMarkPotdSolved';

export default function AdminDashboard() {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [category, setCategory] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const [exampleOutput, setExampleOutput] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(n)');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [acceptanceRate, setAcceptanceRate] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const [markEmail, setMarkEmail] = useState('');
  const [markDate, setMarkDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { addProblem, isAddingProblem, problems, isLoading, refetch } = useProblemsOfTheDay();
  const { error } = useAdminStore();
  const { markSolved, isMarking: isMarkingSolved } = useMarkPotdSolved();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!date || !title.trim() || !description.trim() || !category.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Format date as yyyy-MM-dd for the API
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Create problem data object
    const problemData = {
      date: formattedDate,
      title: title.trim(),
      description: description.trim(),
      difficulty: difficulty,
      category: category.trim(),
      exampleInput: exampleInput.trim(),
      exampleOutput: exampleOutput.trim(),
      timeComplexity: timeComplexity.trim(),
      spaceComplexity: spaceComplexity.trim(),
      likes: parseInt(likes) || 0,
      dislikes: parseInt(dislikes) || 0,
      submissions: parseInt(submissions) || 0,
      acceptanceRate: parseFloat(acceptanceRate) || 0
    };
    
    // Submit the problem
    addProblem(problemData, {
      onSuccess: () => {
        // Reset form on success
        setTitle('');
        setDescription('');
        setDifficulty('MEDIUM');
        setCategory('');
        setExampleInput('');
        setExampleOutput('');
        setTimeComplexity('O(n)');
        setSpaceComplexity('O(n)');
        setLikes(0);
        setDislikes(0);
        setSubmissions(0);
        setAcceptanceRate(0);
        setDate(new Date());
      }
    });
  };
  
  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing problem list...");
  };
  
  const handleMarkSolvedClick = () => {
    if (!markEmail.trim() || !markDate) {
      toast.error('Please enter both email and date to mark as solved.');
      return;
    }
    markSolved({ email: markEmail.trim(), date: markDate });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB]">Admin Dashboard</h1>
          <p className="text-[#A1A1AA]">Manage Problem of the Day and other admin tasks</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            size="sm"
            className="bg-[#161B22] border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <div className="bg-[#0D1117] border border-[#30363D] rounded-md flex p-0.5">
            <Button 
              onClick={() => setViewMode('grid')}
              variant="ghost" 
              size="sm"
              className={`px-2 ${viewMode === 'grid' 
                ? 'bg-[#161B22] text-[#E5E7EB]' 
                : 'bg-transparent text-[#A1A1AA] hover:text-[#E5E7EB]'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setViewMode('list')}
              variant="ghost" 
              size="sm"
              className={`px-2 ${viewMode === 'list' 
                ? 'bg-[#161B22] text-[#E5E7EB]' 
                : 'bg-transparent text-[#A1A1AA] hover:text-[#E5E7EB]'}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-[#30363D]/50">
            <CardTitle className="flex items-center">
              <span className="h-5 w-1 bg-[#0070F3] rounded-full mr-2"></span>
              Add Problem of the Day
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#E5E7EB]">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-[#E5E7EB]">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-[#0D1117] border-[#30363D] text-[#E5E7EB] hover:bg-[#30363D]/50"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#0D1117] border-[#30363D]">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate);
                            setIsCalendarOpen(false);
                          }}
                          initialFocus
                          className="bg-[#0D1117] text-[#E5E7EB]"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-[#E5E7EB]">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter problem title"
                      className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-sm font-medium text-[#E5E7EB]">
                        Difficulty <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2 rounded-md bg-[#0D1117] border border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                        required
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-[#E5E7EB]">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="E.g., Arrays, DP"
                        className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="timeComplexity" className="text-sm font-medium text-[#E5E7EB]">
                        Time Complexity
                      </Label>
                      <Input
                        id="timeComplexity"
                        value={timeComplexity}
                        onChange={(e) => setTimeComplexity(e.target.value)}
                        placeholder="E.g., O(n)"
                        className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="spaceComplexity" className="text-sm font-medium text-[#E5E7EB]">
                        Space Complexity
                      </Label>
                      <Input
                        id="spaceComplexity"
                        value={spaceComplexity}
                        onChange={(e) => setSpaceComplexity(e.target.value)}
                        placeholder="E.g., O(1)"
                        className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-[#E5E7EB] mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="likes" className="text-xs font-medium text-[#E5E7EB]">
                            Likes
                          </Label>
                          <Input
                            id="likes"
                            type="number"
                            min="0"
                            value={likes}
                            onChange={(e) => setLikes(e.target.value)}
                            className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3] h-8 text-sm"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="dislikes" className="text-xs font-medium text-[#E5E7EB]">
                            Dislikes
                          </Label>
                          <Input
                            id="dislikes"
                            type="number"
                            min="0"
                            value={dislikes}
                            onChange={(e) => setDislikes(e.target.value)}
                            className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3] h-8 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="submissions" className="text-xs font-medium text-[#E5E7EB]">
                            Submissions
                          </Label>
                          <Input
                            id="submissions"
                            type="number"
                            min="0"
                            value={submissions}
                            onChange={(e) => setSubmissions(e.target.value)}
                            className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3] h-8 text-sm"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="acceptanceRate" className="text-xs font-medium text-[#E5E7EB]">
                            Accept Rate %
                          </Label>
                          <Input
                            id="acceptanceRate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={acceptanceRate}
                            onChange={(e) => setAcceptanceRate(e.target.value)}
                            className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3] h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#E5E7EB]">Problem Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-[#E5E7EB]">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter problem description with details and instructions"
                      className="min-h-[180px] bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exampleInput" className="text-sm font-medium text-[#E5E7EB]">
                      Example Input
                    </Label>
                    <Textarea
                      id="exampleInput"
                      value={exampleInput}
                      onChange={(e) => setExampleInput(e.target.value)}
                      placeholder="Enter example input"
                      className="min-h-[100px] bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exampleOutput" className="text-sm font-medium text-[#E5E7EB]">
                      Example Output
                    </Label>
                    <Textarea
                      id="exampleOutput"
                      value={exampleOutput}
                      onChange={(e) => setExampleOutput(e.target.value)}
                      placeholder="Enter example output"
                      className="min-h-[100px] bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-md flex items-start space-x-2 text-red-400">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#0070F3] to-[#0057B7] text-white hover:from-[#0057B7] hover:to-[#004494] transition-all"
                disabled={isAddingProblem}
              >
                {isAddingProblem ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span> 
                    Adding Problem...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> 
                    Add Problem of the Day
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-[#30363D]/50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="h-5 w-1 bg-[#0070F3] rounded-full mr-2"></span>
                Recent Problems
              </div>
              <span className="text-xs text-[#A1A1AA] font-normal">
                {problems?.length || 0} problems
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 h-[800px] overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070F3]"></div>
              </div>
            ) : problems && problems.length > 0 ? (
              <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4'}>
                {problems.map((problem, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 bg-[#0D1117] border border-[#30363D] rounded-md ${
                      viewMode === 'list' ? '' : 'flex flex-col h-full'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-[#E5E7EB]">{problem.title}</h3>
                        <div className="flex flex-wrap items-center mt-1 gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            problem.difficulty === 'EASY' ? 'bg-green-900/30 text-green-400' :
                            problem.difficulty === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-400">
                            {problem.category}
                          </span>
                          <span className="text-xs text-[#A1A1AA]">
                            {new Date(problem.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm text-[#A1A1AA] ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'} mb-2 ${
                      viewMode === 'list' ? '' : 'flex-grow'
                    }`}>
                      {problem.description}
                    </p>
                    <div className="flex flex-wrap items-center text-xs text-[#A1A1AA] gap-3">
                      <span>👍 {problem.likes}</span>
                      <span>👎 {problem.dislikes}</span>
                      <span>{problem.submissions} submissions</span>
                      <span>{problem.acceptanceRate}% acceptance</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#0D1117] p-4 rounded-full mb-4">
                  <Plus className="h-6 w-6 text-[#A1A1AA]" />
                </div>
                <p className="text-[#A1A1AA]">No problems added yet</p>
                <p className="text-sm text-[#A1A1AA]/70 mt-1">Add your first problem of the day</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-6">
          <Card className="bg-gradient-to-br from-[#161B22] to-[#1A2233] border-[#30363D] text-[#E5E7EB] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
            <CardHeader className="border-b border-[#30363D]/50">
              <CardTitle className="flex items-center">
                <span className="h-5 w-1 bg-orange-500 rounded-full mr-2"></span>
                Mark POTD Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mark-email" className="text-sm font-medium text-[#E5E7EB]">User Email</Label>
                <Input
                  id="mark-email"
                  type="email"
                  placeholder="user@example.com"
                  value={markEmail}
                  onChange={(e) => setMarkEmail(e.target.value)}
                  className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mark-date" className="text-sm font-medium text-[#E5E7EB]">Date</Label>
                <Input
                  id="mark-date"
                  type="date"
                  value={markDate}
                  onChange={(e) => setMarkDate(e.target.value)}
                  className="bg-[#0D1117] border-[#30363D] text-[#E5E7EB] focus:ring-[#0070F3] appearance-none"
                  style={{ colorScheme: 'dark' }} 
                />
              </div>
              <Button
                onClick={handleMarkSolvedClick}
                disabled={isMarkingSolved || !markEmail || !markDate}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 disabled:opacity-50 text-white"
              >
                {isMarkingSolved ? (
                   <> <span className="animate-spin mr-2">⟳</span> Marking... </> 
                ) : (
                   <> <CheckSquare className="mr-2 h-4 w-4" /> Mark as Solved </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 