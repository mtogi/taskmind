"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

import { taskApi } from "@/lib/api"
import { useError } from "@/hooks/use-error"

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  createdAt: string;
  project?: { id: string; name: string } | null;
}

export default function CalendarPage() {
  const router = useRouter()
  const { captureError } = useError()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("month")
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const data = await taskApi.getAllTasks()
      setTasks(data.tasks || [])
    } catch (error) {
      captureError(error, "Failed to fetch tasks")
      console.error("Error in fetchTasks:", error)
      // For demo purposes only - set mock data
      setTasks([
        {
          id: "1",
          title: "Implement task list view",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
        },
        {
          id: "2",
          title: "Design user settings page",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
        },
        {
          id: "3",
          title: "Setup Stripe integration",
          status: "TODO",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj2", name: "TaskMind Backend" },
        },
        {
          id: "4",
          title: "Write API documentation",
          status: "DONE",
          priority: "LOW",
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj2", name: "TaskMind Backend" },
        },
        {
          id: "5",
          title: "Fix login form validation",
          status: "DONE",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }
  
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' })
  }
  
  const getYear = (date: Date) => {
    return date.getFullYear()
  }
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }
  
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prev.getMonth() - 1)
      return prevMonth
    })
  }
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(prev.getMonth() + 1)
      return nextMonth
    })
  }
  
  const getTasksForDate = (year: number, month: number, day: number) => {
    if (!Array.isArray(tasks)) return []
    
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter(task => {
      if (!task?.dueDate) return false
      try {
        const taskDate = parseISO(task.dueDate)
        if (!isValid(taskDate)) return false
        const taskDateString = format(taskDate, 'yyyy-MM-dd')
        return taskDateString === dateString
      } catch (error) {
        console.warn("Error parsing task date:", task.dueDate, error)
        return false
      }
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      TODO: "bg-slate-500",
      IN_PROGRESS: "bg-blue-500",
      DONE: "bg-green-500"
    }
    return colors[status as keyof typeof colors] || "bg-slate-500"
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "border-l-4 border-red-500"
      case "MEDIUM":
        return "border-l-4 border-yellow-500"
      case "LOW":
        return "border-l-4 border-green-500"
      default:
        return ""
    }
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }
  
  const renderCalendar = () => {
    try {
      const daysInMonth = getDaysInMonth(currentMonth)
      const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
      const year = getYear(currentMonth)
      const month = currentMonth.getMonth()
      
      let days = []
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="p-2 border bg-muted/50"></div>)
      }
      
      // Add cells for days in the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const isToday = new Date().toDateString() === date.toDateString()
        const dayTasks = getTasksForDate(year, month + 1, day)
        
        days.push(
          <div 
            key={day} 
            className={`p-2 border min-h-[100px] ${isToday ? 'bg-primary/10 border-primary' : ''}`}
          >
            <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>{day}</div>
            <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
              {dayTasks.map(task => (
                <TooltipProvider key={task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`text-xs p-1 rounded-sm ${getStatusColor(task.status)} text-white truncate cursor-pointer ${getPriorityIndicator(task.priority)}`}
                        onClick={() => handleTaskClick(task.id)}
                      >
                        {task.title}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{task.title}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getStatusColor(task.status) + " text-white"}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {task.priority}
                          </Badge>
                        </div>
                        {task.project && (
                          <p className="text-xs text-muted-foreground">{task.project.name}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )
      }
      
      return days
    } catch (error) {
      console.error("Error rendering calendar:", error)
      return <div className="col-span-7 p-4 text-center text-muted-foreground">Error rendering calendar</div>
    }
  }

  const renderWeekView = () => {
    // Implementation for week view would go here
    return <div className="p-4 text-center text-muted-foreground">Week view coming soon</div>
  }

  const renderDayView = () => {
    // Implementation for day view would go here
    return <div className="p-4 text-center text-muted-foreground">Day view coming soon</div>
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <Button asChild>
            <a href="/tasks/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </a>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>
                {getMonthName(currentMonth)} {getYear(currentMonth)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Select value={view} onValueChange={setView}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "month" && (
              <div className="grid grid-cols-7 gap-0">
                {daysOfWeek.map(day => (
                  <div key={day} className="p-2 text-center font-medium text-sm border-b">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            )}
            {view === "week" && renderWeekView()}
            {view === "day" && renderDayView()}
          </CardContent>
        </Card>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <span className="text-xs">To Do</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-l-4 border-red-500 h-3 bg-transparent"></div>
            <span className="text-xs">High Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-l-4 border-yellow-500 h-3 bg-transparent"></div>
            <span className="text-xs">Medium Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-l-4 border-green-500 h-3 bg-transparent"></div>
            <span className="text-xs">Low Priority</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 