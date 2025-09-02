'use client';
import { useState } from 'react';
import ContentCard from './ContentCard';
import { type GeneratedContent, type ContentType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentHistoryProps {
  history: GeneratedContent[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function ContentHistory({ history, onDelete, isLoading }: ContentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.generatedContent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.contentType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <h2 className="text-3xl font-headline font-bold mb-6">Content History</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by keyword..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => setFilterType(value as ContentType | 'all')} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="blog">Blog Post</SelectItem>
            <SelectItem value="tweet">Tweet</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="ad copy">Ad Copy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHistory.map((item) => (
            <ContentCard key={item.id} content={item} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <div className="mx-auto h-12 w-12 text-muted-foreground">
            <FileText className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-xl font-semibold font-headline">No Content Yet</h3>
          <p className="mt-2 text-muted-foreground">
            {history.length === 0 
              ? "Generate some content to see your history here."
              : "No content matches your search or filter."
            }
          </p>
        </div>
      )}
    </div>
  );
}
