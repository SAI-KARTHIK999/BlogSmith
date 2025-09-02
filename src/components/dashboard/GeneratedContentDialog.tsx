'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type GeneratedContent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Copy, Save } from 'lucide-react';

interface GeneratedContentDialogProps {
  isOpen: boolean;
  content: GeneratedContent;
  onSave: (content: GeneratedContent) => void;
  onClose: () => void;
}

export default function GeneratedContentDialog({
  isOpen,
  content,
  onSave,
  onClose,
}: GeneratedContentDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content.generatedContent);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Content Generated!</DialogTitle>
          <DialogDescription>Here's your new AI-generated content. You can save it to your history or copy it.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] my-4 border rounded-md p-4">
          <p className="text-sm whitespace-pre-wrap">{content.generatedContent}</p>
        </ScrollArea>
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Discard
          </Button>
          <div className='flex gap-2'>
            <Button variant="secondary" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button onClick={() => onSave(content)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Save className="mr-2 h-4 w-4" /> Save to History
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
