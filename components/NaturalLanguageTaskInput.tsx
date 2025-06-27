"use client"

import { useState, useRef } from "react"
import { Loader2, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"

import { taskApi } from "@/lib/api"
import { useError } from "@/hooks/use-error"

interface NaturalLanguageTaskInputProps {
  onTaskCreated?: () => void
  onCancel?: () => void
}

interface ParsedTask {
  title: string
  description?: string
  priority?: string
  dueDate?: Date
  status?: string
  projectId?: string
}

export default function NaturalLanguageTaskInput({ 
  onTaskCreated,
  onCancel
}: NaturalLanguageTaskInputProps) {
  const { captureError } = useError()
  const [input, setInput] = useState("")
  const [isParsing, setIsParsing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleParseTask = async () => {
    if (!input.trim()) {
      toast.error("Please enter a task description")
      return
    }

    setIsParsing(true)
    try {
      const result = await taskApi.parseTaskText(input)
      setParsedTask(result.parsedTask)
    } catch (error) {
      captureError(error, "Failed to parse task")
      toast.error("Could not parse your task. Please try again or enter details manually.")
      
      // For demo, create a simple parsed task
      setParsedTask({
        title: input,
        description: "",
        priority: input.includes("urgent") || input.includes("important") 
          ? "HIGH" 
          : "MEDIUM",
        status: "TODO",
        dueDate: undefined,
        projectId: undefined
      })
    } finally {
      setIsParsing(false)
    }
  }

  const handleCreateTask = async () => {
    if (!parsedTask) return

    setIsCreating(true)
    try {
      await taskApi.createTask(parsedTask)
      toast.success("Task created successfully")
      setInput("")
      setParsedTask(null)
      if (onTaskCreated) onTaskCreated()
    } catch (error) {
      captureError(error, "Failed to create task")
      toast.error("Error creating task")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    setInput("")
    setParsedTask(null)
    if (onCancel) onCancel()
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleParseTask()
    }
  }

  const updateParsedTask = (field: keyof ParsedTask, value: any) => {
    if (!parsedTask) return
    setParsedTask({ ...parsedTask, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="natural-language-input">
          Describe your task in natural language
        </Label>
        <div className="flex items-start gap-2">
          <Textarea
            ref={inputRef}
            id="natural-language-input"
            placeholder="e.g., 'Create a high priority task to finish the project proposal by next Friday'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1 min-h-24"
            disabled={isParsing || !!parsedTask}
          />
          <div className="space-y-2">
            <Button 
              onClick={handleParseTask} 
              disabled={!input.trim() || isParsing || !!parsedTask}
              className="w-full"
            >
              {isParsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Parse
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Press Ctrl+Enter to parse task
        </p>
      </div>

      {parsedTask && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Task Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input 
                id="task-title" 
                value={parsedTask.title} 
                onChange={(e) => updateParsedTask('title', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea 
                id="task-description" 
                value={parsedTask.description || ''}
                onChange={(e) => updateParsedTask('description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-status">Status</Label>
                <Select 
                  value={parsedTask?.status || 'TODO'} 
                  onValueChange={(value) => updateParsedTask('status', value)}
                >
                  <SelectTrigger id="task-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select 
                  value={parsedTask?.priority || 'MEDIUM'} 
                  onValueChange={(value) => updateParsedTask('priority', value)}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="task-due-date">Due Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="task-due-date"
                    >
                      {parsedTask.dueDate ? (
                        format(parsedTask.dueDate, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parsedTask?.dueDate || undefined}
                      onSelect={(date) => updateParsedTask('dueDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 