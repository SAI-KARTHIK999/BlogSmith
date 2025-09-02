'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ContentGeneratorForm from '@/components/dashboard/ContentGeneratorForm';
import ContentHistory from '@/components/dashboard/ContentHistory';
import GeneratedContentDialog from '@/components/dashboard/GeneratedContentDialog';
import { type GeneratedContent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getContentHistoryAction, saveContentHistoryAction, deleteContentHistoryAction } from '@/app/actions';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [newlyGenerated, setNewlyGenerated] = useState<GeneratedContent | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (user) {
      setIsHistoryLoading(true);
      const result = await getContentHistoryAction(user.email);
      if (result.success && result.data) {
        setHistory(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load content history.",
        });
      }
      setIsHistoryLoading(false);
    }
  }, [user, toast]);
  
  useEffect(() => {
    if (!loading && user) {
      fetchHistory();
    } else if (!loading && !user) {
      setIsHistoryLoading(false);
    }
  }, [user, loading, fetchHistory]);


  const handleContentGenerated = (content: Omit<GeneratedContent, 'id' | 'timestamp'>) => {
    const newContent: GeneratedContent = {
      ...content,
      id: `content_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };
    setNewlyGenerated(newContent);
  };

  const handleSaveContent = async (content: GeneratedContent) => {
    if (!user) return;
    
    const result = await saveContentHistoryAction(content, user.email);
    if (result.success) {
      setHistory(prev => [content, ...prev]);
      setNewlyGenerated(null);
      toast({
        title: 'Content Saved!',
        description: 'Your new content has been added to your history.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: result.error || 'Could not save content to history.',
      });
    }
  };
  
  const handleDeleteContent = async (id: string) => {
    if (!user) return;

    const result = await deleteContentHistoryAction(id, user.email);
    if (result.success) {
      setHistory(prev => prev.filter((item) => item.id !== id));
      toast({
        variant: "destructive",
        title: 'Content Deleted',
        description: 'The selected content has been removed from your history.',
      });
    } else {
       toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: result.error || 'Could not delete content.',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="lg:col-span-8">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <ContentGeneratorForm onContentGenerated={handleContentGenerated} />
        </aside>
        <section className="lg:col-span-8">
          <ContentHistory 
            history={history} 
            onDelete={handleDeleteContent} 
            isLoading={isHistoryLoading} 
          />
        </section>
      </div>
      {newlyGenerated && (
        <GeneratedContentDialog
          isOpen={!!newlyGenerated}
          content={newlyGenerated}
          onSave={handleSaveContent}
          onClose={() => setNewlyGenerated(null)}
        />
      )}
    </div>
  );
}
