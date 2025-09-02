'use server';

import {
  generateContentFromPrompt,
  GenerateContentFromPromptInput,
} from '@/ai/flows/generate-content-from-prompt';
import { z } from 'zod';

const inputSchema = z.object({
  contentType: z.enum(['blog', 'tweet', 'email', 'ad copy']),
  length: z.string().min(1, 'Length is required'),
  tone: z.string().min(1, 'Tone is required'),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
});

export async function generateContentAction(input: GenerateContentFromPromptInput) {
  const validation = inputSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await generateContentFromPrompt(input);
    return { success: true, data: result.generatedContent };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate content. Please try again.' };
  }
}
