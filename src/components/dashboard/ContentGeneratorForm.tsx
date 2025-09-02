'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateContentAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { type ContentType, type GeneratedContent } from '@/lib/types';
import { Sparkles } from 'lucide-react';

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'tweet', label: 'Tweet' },
  { value: 'email', label: 'Email' },
  { value: 'ad copy', label: 'Ad Copy' },
];

const lengths = ['Short', 'Medium', 'Long'];

const generatorSchema = z.object({
  contentType: z.enum(['blog', 'tweet', 'email', 'ad copy']),
  length: z.string().min(1, { message: 'Please select a length.' }),
  tone: z.string().min(1, { message: 'Tone is required.' }),
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters.' }),
});

type GeneratorFormValues = z.infer<typeof generatorSchema>;

interface ContentGeneratorFormProps {
  onContentGenerated: (content: Omit<GeneratedContent, 'id' | 'timestamp'>) => void;
}

export default function ContentGeneratorForm({ onContentGenerated }: ContentGeneratorFormProps) {
  const { toast } = useToast();
  const form = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      contentType: 'blog',
      length: 'Medium',
      tone: '',
      prompt: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: GeneratorFormValues) => {
    const result = await generateContentAction(data);
    if (result.success && result.data) {
      onContentGenerated({ ...data, generatedContent: result.data });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create Content</CardTitle>
        <CardDescription>Fill in the details below to generate new content with AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select onValueChange={(value) => form.setValue('contentType', value as ContentType)} defaultValue={form.getValues('contentType')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Select onValueChange={(value) => form.setValue('length', value)} defaultValue={form.getValues('length')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a length" />
              </SelectTrigger>
              <SelectContent>
                {lengths.map((length) => (
                  <SelectItem key={length} value={length}>
                    {length}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Input id="tone" placeholder="e.g., Formal, Casual, Humorous" {...form.register('tone')} />
            {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" placeholder="e.g., Write a blog post about the benefits of AI..." {...form.register('prompt')} rows={5} />
            {form.formState.errors.prompt && <p className="text-sm text-destructive">{form.formState.errors.prompt.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 btn-glow" disabled={isSubmitting}>
            {isSubmitting ? (
              'Generating...'
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Content
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
