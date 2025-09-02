'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ContentGeneratorForm from '@/components/dashboard/ContentGeneratorForm';
import ContentHistory from '@/components/dashboard/ContentHistory';
import GeneratedContentDialog from '@/components/dashboard/GeneratedContentDialog';
import { type GeneratedContent, type ContentType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [newlyGenerated, setNewlyGenerated] = useState<GeneratedContent | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && user) {
      try {
        const storedHistory = localStorage.getItem(`contentHistory_${user.email}`);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error("Failed to load history from localStorage", e);
      } finally {
        setIsHistoryLoading(false);
      }
    } else if (!loading && !user) {
      setIsHistoryLoading(false);
    }
  }, [user, loading]);

  const updateLocalStorage = (newHistory: GeneratedContent[]) => {
    if (user) {
      localStorage.setItem(`contentHistory_${user.email}`, JSON.stringify(newHistory));
    }
  }

  const handleContentGenerated = (content: Omit<GeneratedContent, 'id' | 'timestamp'>) => {
    const newContent: GeneratedContent = {
      ...content,
      id: `content_${Date.now()}`,
      timestamp: Date.now(),
    };
    setNewlyGenerated(newContent);
  };

  const handleSaveContent = (content: GeneratedContent) => {
    const updatedHistory = [content, ...history];
    setHistory(updatedHistory);
    updateLocalStorage(updatedHistory);
    setNewlyGenerated(null);
    toast({
      title: 'Content Saved!',
      description: 'Your new content has been added to your history.',
    });
  };
  
  const handleDeleteContent = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    updateLocalStorage(updatedHistory);
    toast({
      variant: "destructive",
      title: 'Content Deleted',
      description: 'The selected content has been removed from your history.',
    });
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
