'use server';

import {
  generateContentFromPrompt,
  GenerateContentFromPromptInput,
} from '@/ai/flows/generate-content-from-prompt';
import { GeneratedContent } from '@/lib/types';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';

const contentGeneratorSchema = z.object({
  contentType: z.enum(['blog', 'tweet', 'email', 'ad copy']),
  length: z.string().min(1, 'Length is required'),
  tone: z.string().min(1, 'Tone is required'),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
});

export async function generateContentAction(input: GenerateContentFromPromptInput) {
  const validation = contentGeneratorSchema.safeParse(input);

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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginAction(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields!" };
  }
  const { email, password } = validatedFields.data;

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }
    
    // In a real app, you would compare hashed passwords.
    // For this demo, we'll just check if the password matches.
    if (user.password !== password) {
       return { success: false, error: "Invalid email or password" };
    }

    return { success: true, data: { email: user.email } };

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}


const signupSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(8, { message: 'Minimum 8 characters required' }),
});

export async function signupAction(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    const db = await getDb();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return { success: false, error: "Email already in use!" };
    }

    // In a real app, you should hash the password before saving it.
    await db.collection('users').insertOne({ email, password });

    return { success: true, data: { email } };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function saveContentHistoryAction(content: GeneratedContent, email: string) {
  try {
    const db = await getDb();
    await db.collection('contentHistory').insertOne({ ...content, userEmail: email });
    return { success: true };
  } catch (error) {
    console.error('Failed to save content history:', error);
    return { success: false, error: 'Could not save to history.' };
  }
}

export async function getContentHistoryAction(email: string): Promise<{ success: boolean; data?: GeneratedContent[]; error?: string; }> {
  try {
    const db = await getDb();
    const history = await db.collection('contentHistory').find({ userEmail: email }).sort({ timestamp: -1 }).toArray();
    
    // The data from MongoDB includes _id, which is not serializable for client components.
    // We map it to a serializable format.
    const serializableHistory = history.map(item => ({
      ...item,
      _id: item._id.toString(),
    })) as unknown as GeneratedContent[];

    return { success: true, data: serializableHistory };
  } catch (error) {
    console.error('Failed to get content history:', error);
    return { success: false, error: 'Could not retrieve history.' };
  }
}

export async function deleteContentHistoryAction(id: string, email: string) {
    try {
        const db = await getDb();
        const { ObjectId } = await import('mongodb');
        await db.collection('contentHistory').deleteOne({ _id: new ObjectId(id), userEmail: email });
        return { success: true };
    } catch (error) {
        console.error('Failed to delete content history:', error);
        return { success: false, error: 'Could not delete item.' };
    }
}
