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

    return res.status(200).json(parsedTask);
  } catch (error) {
    console.error('Error parsing task text:', error);
    return res.status(500).json({ message: 'Error parsing task text.' });
  }
}; 