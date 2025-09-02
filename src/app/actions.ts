'use server';

import {
  generateContentFromPrompt,
  GenerateContentFromPromptInput,
} from '@/ai/flows/generate-content-from-prompt';
import { GeneratedContent } from '@/lib/types';
import { z } from 'zod';

// Note: We are not using Firebase Admin SDK here for simplicity.
// In a real production app, you would use the Admin SDK for server-side actions
// to ensure security and proper access control.
// The client-side SDK usage here is for demonstration purposes.

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

// The login and signup actions are now handled on the client-side by useAuth.ts
// We keep these placeholders to show where you'd put server-side validation
// if you weren't using the client-side Firebase SDK for auth.

export async function loginAction(values: any) {
  // This action is now effectively handled on the client side with Firebase Auth.
  // You could add server-side validation or logging here if needed.
  return { success: true, message: "Client-side login process initiated." };
}

export async function signupAction(values: any) {
  // This action is now effectively handled on the client side with Firebase Auth.
  // You could add server-side validation or logging here if needed.
  return { success: true, message: "Client-side signup process initiated." };
}

export async function saveContentHistoryAction(content: GeneratedContent, email: string) {
  try {
    // This would ideally use the Firebase Admin SDK to save data securely.
    // For this demo, we'll let the client write directly to Firestore,
    // which requires appropriate security rules in the Firebase Console.
    // Example: firestore.collection(`users/${userId}/contentHistory`).add(content);
    return { success: true };
  } catch (error) {
    console.error('Failed to save content history:', error);
    return { success: false, error: 'Could not save to history.' };
  }
}

export async function getContentHistoryAction(email: string): Promise<{ success: boolean; data?: GeneratedContent[]; error?: string; }> {
   try {
    // This would ideally use the Firebase Admin SDK to get data securely.
    // For this demo, we'll let the client read directly from Firestore,
    // which requires appropriate security rules.
    return { success: true, data: [] }; // Data fetching is now on the client.
  } catch (error) {
    console.error('Failed to get content history:', error);
    return { success: false, error: 'Could not retrieve history.' };
  }
}

export async function deleteContentHistoryAction(id: string, email: string) {
    try {
        // This would ideally use the Firebase Admin SDK to delete data securely.
        // For this demo, client handles deletion.
        return { success: true };
    } catch (error) {
        console.error('Failed to delete content history:', error);
        return { success: false, error: 'Could not delete item.' };
    }
}
