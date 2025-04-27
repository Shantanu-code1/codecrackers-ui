import React, { useState } from "react"
import { 
  DollarSign, Calendar, TrendingUp, TrendingDown, BarChart2, 
  Download, Filter, CreditCard, Clock, ArrowUpRight, ChevronDown,
  CheckCircle, ArrowRight, FileText, Wallet, AlertCircle, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Header from "../../student/header/Header"

// Mock data for earnings
const mockEarningsData = {
  summary: {
    totalEarnings: 48250.75,
    pendingPayouts: 3450.25,
    availableBalance: 2750.50,
    thisMonth: {
      earnings: 4250.75,
      percentChange: 12.8,
      doubtsResolved: 42,
      appointments: 16,
      hoursTaught: 32
    },
    lastMonth: {
      earnings: 3950.25,
      doubtsResolved: 38,
      appointments: 14,
      hoursTaught: 28
    }
  },
  transactionHistory: [
    {
      id: "txn-001",
      type: "appointment",
      description: "1.5 Hour Appointment - Advanced Algorithms",
      amount: 127.50,
      date: "2023-10-15",
      status: "completed",
      payout: true
    },
    {
      id: "txn-002",
      type: "doubt",
      description: "Doubt Resolution - Database Indexing",
      amount: 35.00,
      date: "2023-10-14",
      status: "completed",
      payout: true
    },
    {
      id: "txn-003",
      type: "appointment",
      description: "1 Hour Appointment - Machine Learning Concepts",
      amount: 85.00,
      date: "2023-10-12",
      status: "completed",
      payout: true
    },
    {
      id: "txn-004",
      type: "doubt",
      description: "Doubt Resolution - JavaScript Promises",
      amount: 35.00,
      date: "2023-10-10",
      status: "completed",
      payout: true
    },
    {
      id: "txn-005",
      type: "payout",
      description: "Monthly payout to bank account",
      amount: -1250.00,
      date: "2023-10-01",
      status: "processed",
      payout: false
    },
    {
      id: "txn-006",
      type: "bonus",
      description: "Performance bonus - High ratings",
      amount: 150.00,
      date: "2023-09-28",
      status: "completed",
      payout: true
    },
    {
      id: "txn-007",
      type: "doubt",
      description: "Doubt Resolution - React Hooks",
      amount: 35.00,
      date: "2023-09-25",
      status: "completed",
      payout: true
    },
    {
      id: "txn-008",
      type: "appointment",
      description: "2 Hour Appointment - System Design",
      amount: 170.00,
      date: "2023-09-22",
      status: "completed",
      payout: true
    },
    {
      id: "txn-009",
      type: "payout",
      description: "Monthly payout to bank account",
      amount: -1350.00,
      date: "2023-09-01",
      status: "processed",
      payout: false
    }
  ],
  monthlyEarnings: [
    { month: "Jan", earnings: 3250.00 },
    { month: "Feb", earnings: 3450.75 },
    { month: "Mar", earnings: 3750.25 },
    { month: "Apr", earnings: 4125.50 },
    { month: "May", earnings: 3925.75 },
    { month: "Jun", earnings: 4250.00 },
    { month: "Jul", earnings: 4500.25 },
    { month: "Aug", earnings: 4250.75 },
    { month: "Sep", earnings: 3950.25 },
    { month: "Oct", earnings: 4250.75 },
    { month: "Nov", earnings: 0 },
    { month: "Dec", earnings: 0 }
  ],
  earningsByType: {
    appointments: 32500.50,
    doubts: 12750.25,
    bonuses: 3000.00
  },
  paymentMethods: [
    {
      id: 1,
      type: "bank_account",
      name: "Chase Bank",
      last4: "6789",
      isDefault: true
    },
    {
      id: 2,
      type: "paypal",
      email: "sarah.chen@example.edu",
      isDefault: false
    }
  ]
};

const TeacherEarningsPage = () => {
  const [timeRange, setTimeRange] = useState("this-month");
  const [filterType, setFilterType] = useState("all");
  const [earningsData, setEarningsData] = useState(mockEarningsData);

  // Function to render the transaction badge based on type
  const renderTransactionBadge = (type) => {
    switch(type) {
      case 'appointment':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">Appointment</Badge>;
      case 'doubt':
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30">Doubt</Badge>;
      case 'payout':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Payout</Badge>;
      case 'bonus':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Bonus</Badge>;
      default:
        return <Badge className="bg-secondary/10 text-secondary border-secondary/30">{type}</Badge>;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary text-text pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Earnings Dashboard</h1>
              <p className="text-text-muted">Track your income and payment history</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-muted border-border text-text">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-text">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-border text-text-muted hover:text-text">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm mb-1">Total Earnings</p>
                    <h3 className="text-2xl font-bold text-text">${earningsData.summary.totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    <p className="text-xs text-text-muted mt-1">Lifetime earnings</p>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm mb-1">This Month</p>
                    <h3 className="text-2xl font-bold text-text">${earningsData.summary.thisMonth.earnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    <div className="flex items-center mt-1">
                      {earningsData.summary.thisMonth.percentChange > 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          <p className="text-xs text-green-500">+{earningsData.summary.thisMonth.percentChange}% from last month</p>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          <p className="text-xs text-red-500">{earningsData.summary.thisMonth.percentChange}% from last month</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <BarChart2 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm mb-1">Pending Payouts</p>
                    <h3 className="text-2xl font-bold text-text">${earningsData.summary.pendingPayouts.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    <p className="text-xs text-text-muted mt-1">Processing for payment</p>
                  </div>
                  <div className="bg-yellow-500/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-muted text-sm mb-1">Available Balance</p>
                    <h3 className="text-2xl font-bold text-text">${earningsData.summary.availableBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    <div className="flex items-center mt-1">
                      <Button variant="link" className="p-0 h-auto text-xs text-secondary hover:text-secondary/90">
                        Request Payout <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Transaction History */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-text">Transaction History</CardTitle>
                      <CardDescription className="text-text-muted">
                        Your earnings and payouts
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-8 px-3 text-xs border-border text-text-muted hover:text-text">
                            <Filter className="h-3 w-3 mr-2" /> Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-text">
                          <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer" onClick={() => setFilterType("all")}>
                            All Transactions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer" onClick={() => setFilterType("appointment")}>
                            Appointments
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer" onClick={() => setFilterType("doubt")}>
                            Doubts
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer" onClick={() => setFilterType("payout")}>
                            Payouts
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted/50 cursor-pointer" onClick={() => setFilterType("bonus")}>
                            Bonuses
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {earningsData.transactionHistory
                      .filter(tx => filterType === "all" || tx.type === filterType)
                      .map((transaction) => (
                        <div key={transaction.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className={`p-2 rounded-full mr-3 ${
                                transaction.type === 'appointment' ? 'bg-blue-500/10' : 
                                transaction.type === 'doubt' ? 'bg-purple-500/10' : 
                                transaction.type === 'bonus' ? 'bg-yellow-500/10' : 
                                'bg-green-500/10'
                              }`}>
                                {transaction.type === 'appointment' ? <Calendar className="h-5 w-5 text-blue-500" /> : 
                                 transaction.type === 'doubt' ? <MessageSquare className="h-5 w-5 text-purple-500" /> : 
                                 transaction.type === 'bonus' ? <ArrowUpRight className="h-5 w-5 text-yellow-500" /> : 
                                 <CreditCard className="h-5 w-5 text-green-500" />}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-text">{transaction.description}</span>
                                  <span className="ml-2">{renderTransactionBadge(transaction.type)}</span>
                                </div>
                                <div className="text-xs text-text-muted mt-1">{transaction.date}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${transaction.amount < 0 ? 'text-text-muted' : 'text-text'}`}>
                                {transaction.amount < 0 ? '-' : '+'} ${Math.abs(transaction.amount).toFixed(2)}
                              </div>
                              <div className="flex items-center justify-end mt-1">
                                <Badge variant="outline" className={`text-xs ${
                                  transaction.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 
                                  transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 
                                  'bg-blue-500/10 text-blue-500 border-blue-500/30'
                                }`}>
                                  {transaction.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                                   transaction.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> : 
                                   <ArrowUpRight className="h-3 w-3 mr-1" />}
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 p-4 flex justify-center">
                  <Button variant="outline" className="border-border text-text-muted hover:text-text">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Side - Charts and Payment Methods */}
            <div className="space-y-8">
              {/* Earnings Breakdown */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-xl text-text">Earnings Breakdown</CardTitle>
                  <CardDescription className="text-text-muted">
                    How your earnings are distributed
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-text-muted text-sm">Appointments</span>
                        <span className="text-text text-sm font-medium">${earningsData.earningsByType.appointments.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(earningsData.earningsByType.appointments / earningsData.summary.totalEarnings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-text-muted text-sm">Doubts</span>
                        <span className="text-text text-sm font-medium">${earningsData.earningsByType.doubts.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(earningsData.earningsByType.doubts / earningsData.summary.totalEarnings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-text-muted text-sm">Bonuses</span>
                        <span className="text-text text-sm font-medium">${earningsData.earningsByType.bonuses.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(earningsData.earningsByType.bonuses / earningsData.summary.totalEarnings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly Comparison Text */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="text-text font-medium mb-2">Monthly Comparison</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-text-muted text-xs">This Month</div>
                        <div className="text-text font-medium">${earningsData.summary.thisMonth.earnings.toFixed(2)}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Calendar className="h-3 w-3 mr-1 text-text-muted" />
                          <span className="text-text-muted">{earningsData.summary.thisMonth.appointments} appointments</span>
                        </div>
                      </div>
                      
                      <div className="h-10 border-r border-border/50 mx-4"></div>
                      
                      <div>
                        <div className="text-text-muted text-xs">Last Month</div>
                        <div className="text-text font-medium">${earningsData.summary.lastMonth.earnings.toFixed(2)}</div>
                        <div className="flex items-center text-xs mt-1">
                          <Calendar className="h-3 w-3 mr-1 text-text-muted" />
                          <span className="text-text-muted">{earningsData.summary.lastMonth.appointments} appointments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Methods */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-xl text-text">Payment Methods</CardTitle>
                  <CardDescription className="text-text-muted">
                    Manage your payout options
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {earningsData.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            method.type === 'bank_account' ? 'bg-blue-500/10' : 'bg-yellow-500/10'
                          }`}>
                            {method.type === 'bank_account' ? 
                              <CreditCard className="h-5 w-5 text-blue-500" /> : 
                              <Wallet className="h-5 w-5 text-yellow-500" />}
                          </div>
                          <div>
                            <div className="font-medium text-text">{method.type === 'bank_account' ? method.name : 'PayPal'}</div>
                            <div className="text-xs text-text-muted mt-1">
                              {method.type === 'bank_account' ? 
                                `Ending in ${method.last4}` : 
                                method.email}
                            </div>
                          </div>
                        </div>
                        {method.isDefault && (
                          <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                            Default
                          </Badge>
                        )}
                      </div>
                    ))}
                    
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Next Payout */}
              <Card className="bg-card border-border shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/10 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-text-muted text-sm">Next Payout</div>
                      <div className="text-text font-medium">November 1, 2023</div>
                    </div>
                    <div className="ml-auto">
                      <Button variant="outline" className="h-8 text-xs border-border text-text-muted hover:text-text">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TeacherEarningsPage 