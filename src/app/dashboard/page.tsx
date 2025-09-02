'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ContentGeneratorForm from '@/components/dashboard/ContentGeneratorForm';
import ContentHistory from '@/components/dashboard/ContentHistory';
import GeneratedContentDialog from '@/components/dashboard/GeneratedContentDialog';
import { type GeneratedContent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [newlyGenerated, setNewlyGenerated] = useState<GeneratedContent | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setIsHistoryLoading(true);
      const q = query(
        collection(db, `users/${user.uid}/contentHistory`),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const historyData: GeneratedContent[] = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              historyData.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toMillis() || Date.now(),
              } as GeneratedContent);
            });
          }
          setHistory(historyData);
          setIsHistoryLoading(false);
        },
        (error) => {
          console.error('Error fetching history:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load content history.',
          });
          setIsHistoryLoading(false);
        }
      );

      return () => unsubscribe();
    } else if (!loading) {
      setIsHistoryLoading(false);
      setHistory([]);
    }
  }, [user, loading, toast]);

  const handleContentGenerated = (
    content: Omit<GeneratedContent, 'id' | 'timestamp'>
  ) => {
    const newContent: GeneratedContent = {
      ...content,
      id: `temp_${Date.now()}`, // Temporary ID
      timestamp: Date.now(),
    };
    setNewlyGenerated(newContent);
  };

  const handleSaveContent = async (content: GeneratedContent) => {
    if (!user) return;

    try {
      const { id, ...contentToSave } = content; // remove temp id
      await addDoc(collection(db, `users/${user.uid}/contentHistory`), {
        ...contentToSave,
        timestamp: serverTimestamp(),
      });
      setNewlyGenerated(null);
      toast({
        title: 'Content Saved!',
        description: 'Your new content has been added to your history.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save content to history.',
      });
    }
  };

  const handleDeleteContent = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!user || !itemToDelete) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/contentHistory`, itemToDelete));
      toast({
        variant: 'destructive',
        title: 'Content Deleted',
        description:
          'The selected content has been removed from your history.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Could not delete content.',
      });
    } finally {
      setItemToDelete(null);
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
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
