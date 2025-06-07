import { Request, Response } from 'express';
import OpenAI from 'openai';
import config from '../config/config';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

interface ParsedTask {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  projectId?: string;
  tags?: string[];
}

export const parseTaskText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!text) {
      return res.status(400).json({ message: 'Text is required.' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that parses natural language task descriptions into structured data. 
          Extract the following information from the user's input:
          - title: The main task title
          - description: Any additional details about the task
          - status: One of [TODO, IN_PROGRESS, DONE]. Default to TODO if not specified.
          - priority: One of [LOW, MEDIUM, HIGH]. Default to MEDIUM if not specified.
          - dueDate: The due date in YYYY-MM-DD format if specified
          - tags: An array of tags or categories if specified`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const parsedContent = completion.choices[0]?.message?.content;
    
    if (!parsedContent) {
      return res.status(500).json({ message: 'Failed to parse task text.' });
    }

    // Parse the response from OpenAI
    const parsedTask: ParsedTask = JSON.parse(parsedContent);

    // Convert dueDate to a proper format if it exists
    if (parsedTask.dueDate) {
      try {
        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(parsedTask.dueDate)) {
          // Ensure it's a valid date
          const dateObj = new Date(parsedTask.dueDate);
          if (isNaN(dateObj.getTime())) {
            // Invalid date, remove it
            delete parsedTask.dueDate;
          }
        } else {
          // Not in the expected format, remove it
          delete parsedTask.dueDate;
        }
      } catch (error) {
        // If any error occurs during date processing, remove the dueDate
        delete parsedTask.dueDate;
      }
    }

    // Validate status
    if (parsedTask.status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(parsedTask.status)) {
      parsedTask.status = 'TODO';
    }

    // Validate priority
    if (parsedTask.priority && !['LOW', 'MEDIUM', 'HIGH'].includes(parsedTask.priority)) {
      parsedTask.priority = 'MEDIUM';
    }

    return res.status(200).json({ parsedTask });
  } catch (error) {
    console.error('Error parsing task text:', error);
    return res.status(500).json({ message: 'Error parsing task text.' });
  }
}; 