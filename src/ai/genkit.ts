import {genkit} from 'genkit';
import {googleAI, gemini15Flash} from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config();

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
  model: gemini15Flash,
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  },
});
