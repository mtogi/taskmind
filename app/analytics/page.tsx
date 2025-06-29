"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your productivity and task completion metrics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">
                +14% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32h 24m</div>
              <p className="text-xs text-muted-foreground">
                +2h from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                -2 from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="time">Time Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Score</CardTitle>
                <CardDescription>
                  Your productivity metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <p className="text-muted-foreground">Productivity Chart Placeholder</p>
                    <p className="text-xs text-muted-foreground">This would be a line chart showing productivity over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>
                  Your task completion metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <p className="text-muted-foreground">Task Completion Chart Placeholder</p>
                    <p className="text-xs text-muted-foreground">This would be a bar chart showing tasks completed by category</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>
                  How you spend your time across different task categories
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <p className="text-muted-foreground">Time Distribution Chart Placeholder</p>
                    <p className="text-xs text-muted-foreground">This would be a pie chart showing time spent by category</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
            <CardDescription>
              AI-generated insights based on your work patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Most Productive Day</p>
                  <p className="text-sm text-muted-foreground">You complete 28% more tasks on Tuesdays than any other day.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Focus Time Recommendation</p>
                  <p className="text-sm text-muted-foreground">Setting aside focused time blocks between 9am-11am could improve your productivity by up to 15%.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Task Breakdown</p>
                  <p className="text-sm text-muted-foreground">Breaking large tasks into smaller chunks has increased your completion rate by 23%.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 