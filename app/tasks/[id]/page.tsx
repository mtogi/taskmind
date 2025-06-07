"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit2, 
  Loader2, 
  Save, 
  Trash2 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { taskApi } from "@/lib/api"
import { useError } from "@/hooks/use-error"

interface TaskDetailProps {
  params: {
    id: string
  }
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  project?: { id: string; name: string } | null;
  subtasks?: Task[];
}

export default function TaskDetailPage({ params }: TaskDetailProps) {
  const { id } = params
  const router = useRouter()
  const { captureError } = useError()
  
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    setIsLoading(true)
    try {
      const data = await taskApi.getTaskById(id)
      setTask(data)
    } catch (error) {
      captureError(error, "Failed to fetch task details")
      
      // For demo purposes only - mock data
      if (id === "1") {
        setTask({
          id: "1",
          title: "Implement task list view",
          description: "Create a comprehensive task list with sorting and filtering capabilities. Include a search function and the ability to filter by status and priority.",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
          subtasks: [
            {
              id: "1-1",
              title: "Design task table component",
              status: "DONE",
              priority: "MEDIUM",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "1-2",
              title: "Implement sorting functionality",
              status: "IN_PROGRESS",
              priority: "MEDIUM",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "1-3",
              title: "Add filters for status and priority",
              status: "TODO",
              priority: "LOW",
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ]
        })
      } else {
        toast.error("Task not found")
        router.push("/tasks")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!task) return
    
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }
    
    try {
      await taskApi.deleteTask(id)
      toast.success("Task deleted successfully")
      router.push("/tasks")
    } catch (error) {
      captureError(error, "Failed to delete task")
      toast.error("Error deleting task")
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return
    
    try {
      await taskApi.updateTask(id, { status: newStatus })
      setTask(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Task marked as ${newStatus.toLowerCase().replace('_', ' ')}`)
    } catch (error) {
      captureError(error, "Failed to update task status")
      toast.error("Error updating task status")
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      LOW: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    }
    return colors[priority as keyof typeof colors] || "bg-blue-100 text-blue-800"
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      TODO: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
      IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      DONE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    }
    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-800"
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading task details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div>
            <Button variant="outline" size="sm" onClick={() => router.push("/tasks")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </div>
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">Task not found.</p>
                <Button className="mt-4" asChild>
                  <Link href="/tasks">
                    Return to Tasks
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => router.push("/tasks")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tasks/${id}/edit`}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteTask}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                    {task.project && (
                      <CardDescription>
                        Project: {task.project.name}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={getStatusBadge(task.status)} variant="outline">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p className="whitespace-pre-line">{task.description || "No description provided."}</p>
                  </div>

                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Subtasks</h3>
                      <ul className="space-y-2">
                        {task.subtasks.map((subtask) => (
                          <li key={subtask.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              {subtask.status === "DONE" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : subtask.status === "IN_PROGRESS" ? (
                                <Clock className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-slate-500" />
                              )}
                              <span>{subtask.title}</span>
                            </div>
                            <Badge className={getPriorityBadge(subtask.priority)} variant="outline">
                              {subtask.priority}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                    <Badge className={getPriorityBadge(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                  {task.updatedAt && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(task.updatedAt)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {task.status !== "TODO" && (
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleStatusChange("TODO")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark as To Do
                    </Button>
                  )}
                  {task.status !== "IN_PROGRESS" && (
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleStatusChange("IN_PROGRESS")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark as In Progress
                    </Button>
                  )}
                  {task.status !== "DONE" && (
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleStatusChange("DONE")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    asChild
                  >
                    <Link href={`/tasks/${id}/edit`}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Task
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 