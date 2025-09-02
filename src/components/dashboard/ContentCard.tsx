'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  MessageSquare,
  Mail,
  Megaphone,
  MoreVertical,
  Copy,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import { type GeneratedContent, type ContentType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: GeneratedContent;
  onDelete: (id: string) => void;
}

const contentIcons: Record<ContentType, React.ReactNode> = {
  blog: <FileText className="h-5 w-5" />,
  tweet: <MessageSquare className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  'ad copy': <Megaphone className="h-5 w-5" />,
};

const contentLabels: Record<ContentType, string> = {
  blog: 'Blog Post',
  tweet: 'Tweet',
  email: 'Email',
  'ad copy': 'Ad Copy',
};

export default function ContentCard({ content, onDelete }: ContentCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content.generatedContent);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content.generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${content.contentType.replace(' ', '_')}_${content.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Download started!' });
  };

  const timeAgo = formatDistanceToNow(new Date(content.timestamp), { addSuffix: true });

  return (
    <>
      <Card className="flex flex-col h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <span className="text-accent">{contentIcons[content.contentType]}</span>
                {contentLabels[content.contentType]}
              </CardTitle>
              <CardDescription className="mt-1">
                Generated {timeAgo}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(content.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {content.generatedContent}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsViewOpen(true)}>
            View Content
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-3">
              <span className="text-accent">{contentIcons[content.contentType]}</span>
              {contentLabels[content.contentType]}
            </DialogTitle>
            <DialogDescription>Generated {timeAgo}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 space-y-6">
            <div>
              <h4 className="font-semibold font-headline">Prompt</h4>
              <p className="text-sm text-muted-foreground mt-1 bg-secondary p-3 rounded-md">{content.prompt}</p>
            </div>
            <div>
              <h4 className="font-semibold font-headline">Generated Content</h4>
              <p className="text-sm whitespace-pre-wrap mt-1">{content.generatedContent}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
