import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-headline font-bold text-foreground">
        BlogSmith
      </span>
    </Link>
  );
}
