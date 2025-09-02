export type ContentType = 'blog' | 'tweet' | 'email' | 'ad copy';

export interface GeneratedContent {
  id: string;
  contentType: ContentType;
  length: string;
  tone: string;
  prompt: string;
  generatedContent: string;
  timestamp: number;
}
