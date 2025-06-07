"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2,
  Clock,
  Trash2,
  Pencil,
  ChevronDown,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { taskApi } from "@/lib/api"
import { useError } from "@/hooks/use-error"

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: Date | string | null;
  createdAt: Date | string;
  project?: { id: string; name: string } | null;
}

export default function TasksPage() {
  const router = useRouter();
  const { captureError } = useError();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task;
    direction: 'ascending' | 'descending';
  }>({ key: 'createdAt', direction: 'descending' });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortConfig]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskApi.getAllTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      captureError(error, "Failed to fetch tasks");
      // For demo, set mock data
      setTasks([
        {
          id: "1",
          title: "Implement task list view",
          description: "Create a comprehensive task list with sorting and filtering",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
        },
        {
          id: "2",
          title: "Design user settings page",
          description: "Create UI for user profile and settings",
          status: "TODO",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
        },
        {
          id: "3",
          title: "Setup Stripe integration",
          description: "Implement payment processing with Stripe",
          status: "TODO",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj2", name: "TaskMind Backend" },
        },
        {
          id: "4",
          title: "Write API documentation",
          description: "Document all API endpoints",
          status: "DONE",
          priority: "LOW",
          dueDate: null,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj2", name: "TaskMind Backend" },
        },
        {
          id: "5",
          title: "Fix login form validation",
          description: "Address validation issues in the login form",
          status: "DONE",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          project: { id: "proj1", name: "TaskMind Frontend" },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        task => 
          task.title.toLowerCase().includes(term) || 
          (task.description && task.description.toLowerCase().includes(term)) ||
          (task.project && task.project.name.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter) {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Sort the results
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        // For dates or other types
        // @ts-ignore
        comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });

    setFilteredTasks(result);
  };

  const handleSort = (key: keyof Task) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      captureError(error, "Failed to delete task");
      toast.error("Error deleting task");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await taskApi.updateTask(id, { status: newStatus });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
      toast.success(`Task marked as ${newStatus.toLowerCase().replace('_', ' ')}`);
    } catch (error) {
      captureError(error, "Failed to update task status");
      toast.error("Error updating task status");
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      LOW: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return colors[priority as keyof typeof colors] || "bg-blue-100 text-blue-800";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      TODO: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
      IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      DONE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      Status
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        className={!statusFilter ? "bg-accent" : ""}
                        onClick={() => setStatusFilter(null)}
                      >
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === "TODO" ? "bg-accent" : ""}
                        onClick={() => setStatusFilter("TODO")}
                      >
                        To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === "IN_PROGRESS" ? "bg-accent" : ""}
                        onClick={() => setStatusFilter("IN_PROGRESS")}
                      >
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={statusFilter === "DONE" ? "bg-accent" : ""}
                        onClick={() => setStatusFilter("DONE")}
                      >
                        Completed
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      Priority
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        className={!priorityFilter ? "bg-accent" : ""}
                        onClick={() => setPriorityFilter(null)}
                      >
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={priorityFilter === "HIGH" ? "bg-accent" : ""}
                        onClick={() => setPriorityFilter("HIGH")}
                      >
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={priorityFilter === "MEDIUM" ? "bg-accent" : ""}
                        onClick={() => setPriorityFilter("MEDIUM")}
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={priorityFilter === "LOW" ? "bg-accent" : ""}
                        onClick={() => setPriorityFilter("LOW")}
                      >
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tasks Table */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No tasks found.</p>
                <Button className="mt-4" asChild>
                  <Link href="/tasks/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%] cursor-pointer" onClick={() => handleSort('title')}>
                        Title
                        {sortConfig.key === 'title' && (
                          <ChevronDown className={`h-4 w-4 inline ml-1 transform ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                        Status
                        {sortConfig.key === 'status' && (
                          <ChevronDown className={`h-4 w-4 inline ml-1 transform ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                        Priority
                        {sortConfig.key === 'priority' && (
                          <ChevronDown className={`h-4 w-4 inline ml-1 transform ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                        Due Date
                        {sortConfig.key === 'dueDate' && (
                          <ChevronDown className={`h-4 w-4 inline ml-1 transform ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                        )}
                      </TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow 
                        key={task.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(task.status)} variant="outline">
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityBadge(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.dueDate ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(task.dueDate)}
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          {task.project ? task.project.name : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}/edit`)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {task.status !== "TODO" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "TODO")}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Mark as To Do
                                  </DropdownMenuItem>
                                )}
                                {task.status !== "IN_PROGRESS" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "IN_PROGRESS")}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                )}
                                {task.status !== "DONE" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "DONE")}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 