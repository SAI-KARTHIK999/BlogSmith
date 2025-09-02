import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-background">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight md:text-6xl text-glow">
          BlogSmith
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/90">
          Where Ideas Meet the Smith’s Hammer
        </p>
        <div className="mt-8">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 btn-glow">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
